import paginate from '../../helpers/pagination';
import Execution from '../../models/execution';

const getExecutionSteps = async (_parent, params, context) => {
  const conditions = context.currentUser.can('read', 'Execution');
  const userExecutions = context.currentUser.$relatedQuery('executions');
  const allExecutions = Execution.query();
  const executionBaseQuery = conditions.isCreator
    ? userExecutions
    : allExecutions;

  const execution = await executionBaseQuery
    .clone()
    .withSoftDeleted()
    .findById(params.executionId)
    .throwIfNotFound();

  const executionSteps = execution
    .$relatedQuery('executionSteps')
    .withSoftDeleted()
    .withGraphFetched('step')
    .orderBy('created_at', 'asc');

  return paginate(executionSteps, params.limit, params.offset);
};

export default getExecutionSteps;
