import Execution from '../../models/execution';

const getExecution = async (_parent, params, context) => {
  const conditions = context.currentUser.can('read', 'Execution');
  const userExecutions = context.currentUser.$relatedQuery('executions');
  const allExecutions = Execution.query();
  const executionBaseQuery = conditions.isCreator
    ? userExecutions
    : allExecutions;

  const execution = await executionBaseQuery
    .clone()
    .withGraphFetched({
      flow: {
        steps: true,
      },
    })
    .withSoftDeleted()
    .findById(params.executionId)
    .throwIfNotFound();

  return execution;
};

export default getExecution;
