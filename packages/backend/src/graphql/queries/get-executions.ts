import Context from '../../types/express/context';
import paginate from '../../helpers/pagination';

type Params = {
  limit: number;
  offset: number;
};

const getExecutions = async (
  _parent: unknown,
  params: Params,
  context: Context
) => {
  const executions = context.currentUser
    .$relatedQuery('executions')
    .withGraphFetched({
      flow: {
        steps: true
      }
    })
    .orderBy('created_at', 'desc');

  return paginate(executions, params.limit, params.offset);
};

export default getExecutions;
