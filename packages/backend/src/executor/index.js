import Flow from '@/models/flow.js';
import { logger } from '@/helpers/logger.js';
import globalVariable from '@/helpers/global-variable.js';
import triggerQueue from '@/queues/trigger.js';
import {
  REMOVE_AFTER_7_DAYS_OR_50_JOBS,
  REMOVE_AFTER_30_DAYS_OR_150_JOBS,
} from '@/config/queue.js';
import { EarlyExitError } from '@/errors/early-exit-error.js';
import { AlreadyProcessedError } from '@/errors/already-processed-error.js';
import { HttpError } from '@/errors/http-error.js';

const runExecutor = async ({ flowId, testRun }) => {
  const flow = await Flow.query().findById(flowId);

  if (!flow) {
    logger.info(`Flow ${flowId} not found!`);
    return;
  }

  const user = await flow.$relatedQuery('user');
  const allowedToRunFlows = await user.isAllowedToRunFlows();

  if (!allowedToRunFlows) {
    logger.info(`User ${user.id} is not allowed to run flows!`);
    return;
  }

  const triggerStep = await flow.getTriggerStep();
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
};

export default runExecutor;
