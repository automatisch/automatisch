import Flow from '../models/flow';
import globalVariable from '../helpers/global-variable';

type ProcessFlowOptions = {
  flowId: string;
  testRun?: boolean;
};

export const processFlow = async (options: ProcessFlowOptions) => {
  const flow = await Flow.query().findById(options.flowId).throwIfNotFound();

  const triggerStep = await flow.getTriggerStep();
  const triggerCommand = await triggerStep.getTriggerCommand();

  const $ = await globalVariable({
    flow,
    connection: await triggerStep.$relatedQuery('connection'),
    app: await triggerStep.getApp(),
    step: triggerStep,
    testRun: options.testRun,
  });

  try {
    await triggerCommand.run($);
  } catch (error) {
    if (error?.response?.httpError) {
      $.triggerOutput.error = error.response.httpError;
    } else {
      try {
        $.triggerOutput.error = JSON.parse(error.message);
      } catch {
        $.triggerOutput.error = { error: error.message };
      }
    }
  }

  if (triggerCommand?.sort) {
    $.triggerOutput.data.sort(triggerCommand.sort);
  }

  return $.triggerOutput;
};
