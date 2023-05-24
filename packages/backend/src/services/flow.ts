import Flow from '../models/flow';
import globalVariable from '../helpers/global-variable';
import EarlyExitError from '../errors/early-exit';
import AlreadyProcessedError from '../errors/already-processed';
import HttpError from '../errors/http';
import { logger } from '../helpers/logger';

type ProcessFlowOptions = {
  flowId: string;
  testRun?: boolean;
};

export const processFlow = async (options: ProcessFlowOptions) => {
  const { testRun, flowId } = options;
  const flow = await Flow.query().findById(flowId).throwIfNotFound();
  const triggerStep = await flow.getTriggerStep();
  const triggerCommand = await triggerStep.getTriggerCommand();

  const $ = await globalVariable({
    flow,
    connection: await triggerStep.$relatedQuery('connection'),
    app: await triggerStep.getApp(),
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
      logger.error(error);

      if (error instanceof HttpError) {
        $.triggerOutput.error = error.details;
      } else {
        try {
          $.triggerOutput.error = JSON.parse(error.message);
        } catch {
          $.triggerOutput.error = { error: error.message };
        }
      }
    }
  }

  return $.triggerOutput;
};
