import Context from '../../types/express/context';
import paginate from '../../helpers/pagination';

type Params = {
  executionId: string;
  limit: number;
  offset: number;
};

const getExecutionSteps = async (
  _parent: unknown,
  params: Params,
  context: Context
) => {
  context.currentUser.can('read', 'Execution');

  const execution = await context.currentUser
    .$relatedQuery('executions')
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
