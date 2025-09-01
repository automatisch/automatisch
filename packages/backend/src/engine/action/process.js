import buildActionStepContext from '@/engine/action/context.js';
import ExecutionStep from '@/models/execution-step.js';
import computeParameters from '@/helpers/compute-parameters.js';
import globalVariable from '@/engine/global-variable.js';
import { logger } from '@/helpers/logger.js';
import HttpError from '@/errors/http.js';
import EarlyExitError from '@/errors/early-exit.js';
import AlreadyProcessedError from '@/errors/already-processed.js';

const processActionStep = async (options) => {
  const { flow, stepId, executionId } = options;

  // Build the action step context
  const { step, execution, app, connection, command } =
    await buildActionStepContext({
      stepId,
      executionId,
    });

  const $ = await globalVariable({
    flow,
    app,
    step,
    connection,
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

  $.step.parameters = computedParameters;

  try {
    await command.run($);
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

  return { executionStep, computedParameters };
};

export default processActionStep;
