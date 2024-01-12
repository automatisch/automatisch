import Step from '../models/step.js';
import Flow from '../models/flow.js';
import Execution from '../models/execution.js';
import ExecutionStep from '../models/execution-step.js';
import computeParameters from '../helpers/compute-parameters.js';
import globalVariable from '../helpers/global-variable.js';
import { logger } from '../helpers/logger.js';
import HttpError from '../errors/http.js';
import EarlyExitError from '../errors/early-exit.js';
import AlreadyProcessedError from '../errors/already-processed.js';

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

  const computedParameters = computeParameters(
    $.step.parameters,
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
      logger.error(error);

      if (error instanceof HttpError) {
        $.actionOutput.error = error.details;
      } else {
        try {
          $.actionOutput.error = JSON.parse(error.message);
        } catch {
          $.actionOutput.error = { error: error.message };
        }
      }
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
