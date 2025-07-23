import Step from '@/models/step.js';
import Flow from '@/models/flow.js';
import Execution from '@/models/execution.js';
import ExecutionStep from '@/models/execution-step.js';
import computeParameters from '@/helpers/compute-parameters.js';
import { logger } from '@/helpers/logger.js';
import globalVariable from '@/helpers/global-variable.js';
import triggerQueue from '@/queues/trigger.js';
import {
  REMOVE_AFTER_7_DAYS_OR_50_JOBS,
  REMOVE_AFTER_30_DAYS_OR_150_JOBS,
} from '@/helpers/remove-job-configuration.js';
import EarlyExitError from '@/errors/early-exit.js';
import AlreadyProcessedError from '@/errors/already-processed.js';
import HttpError from '@/errors/http.js';

export const runExecutor = async ({ flowId, untilStepId, testRun }) => {
  const flow = await Flow.query().findById(flowId);
  let untilStep;

  if (!flow) {
    logger.info(`Flow ${flowId} not found!`);
    return;
  }

  if (testRun) {
    untilStep = await flow.$relatedQuery('steps').findById(untilStepId);

    if (!untilStep) {
      logger.info(`Until step ${untilStepId} not found!`);
      return;
    }
  }

  const user = await flow.$relatedQuery('user');
  const allowedToRunFlows = await user.isAllowedToRunFlows();

  if (!allowedToRunFlows) {
    logger.info(`User ${user.id} is not allowed to run flows!`);
    return;
  }

  const triggerStep = await flow.getTriggerStep();
  const actionSteps = await flow.getActionSteps();
  const triggerCommand = await triggerStep.getTriggerCommand();
  const triggerConnection = await triggerStep.$relatedQuery('connection');
  const triggerApp = await triggerStep.getApp();

  const $ = await globalVariable({
    flow,
    connection: triggerConnection,
    app: triggerApp,
    step: triggerStep,
    testRun,
  });

  try {
    if (triggerCommand.type === 'webhook' && !flow.active) {
      await triggerCommand.testRun($);
    } else {
      await triggerCommand.run($);
    }
  } catch (error) {
    const shouldEarlyExit = error instanceof EarlyExitError;
    const shouldNotProcess = error instanceof AlreadyProcessedError;
    const shouldNotConsiderAsError = shouldEarlyExit || shouldNotProcess;

    if (!shouldNotConsiderAsError) {
      if (error instanceof HttpError) {
        $.triggerOutput.error = error.details;
      } else {
        try {
          $.triggerOutput.error = JSON.parse(error.message);
        } catch {
          $.triggerOutput.error = { error: error.message };
        }
      }

      logger.error(error);
    }
  }

  const { data, error } = $.triggerOutput;

  if (testRun && error) {
    const { executionStep: triggerExecutionStepWithError } =
      await processTrigger({
        flowId: flow.id,
        stepId: triggerStep.id,
        error,
        testRun: true,
      });

    return { executionStep: triggerExecutionStepWithError };
  }

  if (testRun && !error) {
    const firstTriggerItem = data[0];

    const { executionId, executionStep: triggerExecutionStep } =
      await processTrigger({
        flowId: flow.id,
        stepId: triggerStep.id,
        triggerItem: firstTriggerItem,
        testRun: true,
      });

    if (triggerStep.id === untilStep.id) {
      return { executionStep: triggerExecutionStep };
    }

    for (const actionStep of actionSteps) {
      const { executionStep: actionExecutionStep } = await processAction({
        flowId: flow.id,
        stepId: actionStep.id,
        executionId,
      });

      if (actionStep.id === untilStep.id || actionExecutionStep.isFailed) {
        return { executionStep: actionExecutionStep };
      }
    }

    return;
  }

  if (!testRun) {
    const reversedData = data.reverse();

    const jobOptions = {
      removeOnComplete: REMOVE_AFTER_7_DAYS_OR_50_JOBS,
      removeOnFail: REMOVE_AFTER_30_DAYS_OR_150_JOBS,
    };

    for (const triggerItem of reversedData) {
      const jobName = `${triggerStep.id}-${triggerItem.meta.internalId}`;

      const jobPayload = {
        flowId,
        stepId: triggerStep.id,
        triggerItem,
      };

      await triggerQueue.add(jobName, jobPayload, jobOptions);
    }

    if (error) {
      const jobName = `${triggerStep.id}-error`;

      const jobPayload = {
        flowId,
        stepId: triggerStep.id,
        error,
      };

      await triggerQueue.add(jobName, jobPayload, jobOptions);
    }
  }
};

export const processTrigger = async (options) => {
  const { flowId, stepId, triggerItem, error, testRun } = options;

  const step = await Step.query().findById(stepId).throwIfNotFound();

  const $ = await globalVariable({
    flow: await Flow.query().findById(flowId).throwIfNotFound(),
    app: await step.getApp(),
    step: step,
    connection: await step.$relatedQuery('connection'),
  });

  // check if we already process this trigger data item or not!

  const execution = await Execution.query().insert({
    flowId: $.flow.id,
    testRun,
    internalId: triggerItem?.meta.internalId,
  });

  const executionStep = await execution
    .$relatedQuery('executionSteps')
    .insertAndFetch({
      stepId: $.step.id,
      status: error ? 'failure' : 'success',
      dataIn: $.step.parameters,
      dataOut: !error ? triggerItem?.raw : null,
      errorDetails: error,
    });

  return { flowId, stepId, executionId: execution.id, executionStep };
};

export const processAction = async (options) => {
  const { flowId, stepId, executionId } = options;

  const flow = await Flow.query().findById(flowId).throwIfNotFound();
  const execution = await Execution.query()
    .findById(executionId)
    .throwIfNotFound();

  const step = await Step.query().findById(stepId).throwIfNotFound();

  const $ = await globalVariable({
    flow,
    app: await step.getApp(),
    step: step,
    connection: await step.$relatedQuery('connection'),
    execution,
  });

  const priorExecutionSteps = await ExecutionStep.query().where({
    execution_id: $.execution.id,
  });

  const stepSetupAndDynamicFields = await step.getSetupAndDynamicFields();

  const computedParameters = computeParameters(
    $.step.parameters,
    stepSetupAndDynamicFields,
    priorExecutionSteps
  );

  const actionCommand = await step.getActionCommand();

  $.step.parameters = computedParameters;

  try {
    await actionCommand.run($);
  } catch (error) {
    const shouldEarlyExit = error instanceof EarlyExitError;
    const shouldNotProcess = error instanceof AlreadyProcessedError;
    const shouldNotConsiderAsError = shouldEarlyExit || shouldNotProcess;

    if (!shouldNotConsiderAsError) {
      if (error instanceof HttpError) {
        $.actionOutput.error = error.details;
      } else {
        try {
          $.actionOutput.error = JSON.parse(error.message);
        } catch {
          $.actionOutput.error = { error: error.message };
        }
      }

      logger.error(error);
    }
  }

  const executionStep = await execution
    .$relatedQuery('executionSteps')
    .insertAndFetch({
      stepId: $.step.id,
      status: $.actionOutput.error ? 'failure' : 'success',
      dataIn: computedParameters,
      dataOut: $.actionOutput.error ? null : $.actionOutput.data?.raw,
      errorDetails: $.actionOutput.error ? $.actionOutput.error : null,
    });

  return { flowId, stepId, executionId, executionStep, computedParameters };
};
