import Step from '@/models/step.js';
import Execution from '@/models/execution.js';

const buildActionStepContext = async (options) => {
  const { stepId, executionId } = options;

  const step = await Step.query().findById(stepId).throwIfNotFound();
  const app = await step.getApp();
  const connection = await step.$relatedQuery('connection');
  const command = await step.getActionCommand();

  const execution = await Execution.query()
    .findById(executionId)
    .throwIfNotFound();

  return {
    step,
    execution,
    app,
    connection,
    command,
  };
};

export default buildActionStepContext;
