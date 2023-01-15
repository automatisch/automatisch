import Step from '../models/step';
import Flow from '../models/flow';
import Execution from '../models/execution';
import ExecutionStep from '../models/execution-step';
import computeParameters from '../helpers/compute-parameters';
import globalVariable from '../helpers/global-variable';
import HttpError from '../errors/http';
import EarlyExitError from '../errors/early-exit';
import AlreadyProcessedError from '../errors/already-processed';

type ProcessActionOptions = {
  flowId: string;
  executionId: string;
  stepId: string;
};

export const processAction = async (options: ProcessActionOptions) => {
  const { flowId, stepId, executionId } = options;

  const step = await Step.query().findById(stepId).throwIfNotFound();
  const execution = await Execution.query()
    .findById(executionId)
    .throwIfNotFound();

  const $ = await globalVariable({
    flow: await Flow.query().findById(flowId).throwIfNotFound(),
    app: await step.getApp(),
    step: step,
    connection: await step.$relatedQuery('connection'),
    execution: execution,
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
