import globalVariable from '@/engine/global-variable.js';
import EarlyExitError from '@/errors/early-exit.js';
import AlreadyProcessedError from '@/errors/already-processed.js';
import HttpError from '@/errors/http.js';
import { logger } from '@/helpers/logger.js';

const getInitialData = async (options) => {
  const {
    testRun,
    flow,
    triggerStep,
    triggerConnection,
    triggerApp,
    triggerCommand,
    request,
    triggeredByRequest,
    isBuiltInApp,
  } = options;

  const $ = await globalVariable({
    flow,
    connection: triggerConnection,
    app: triggerApp,
    step: triggerStep,
    testRun,
    request,
  });

  try {
    if (triggeredByRequest && isBuiltInApp) {
      await triggerCommand.run($);
    } else if (testRun && triggerCommand.type === 'webhook') {
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

  return { data: $.triggerOutput.data, error: $.triggerOutput.error };
};

export default getInitialData;
