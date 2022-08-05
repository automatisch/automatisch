import Context from '../../types/express/context';
import paginate from '../../helpers/pagination';

type Params = {
  appKey?: string;
  limit: number;
  offset: number;
};

const getFlows = async (_parent: unknown, params: Params, context: Context) => {
  const userStepsQuery = context.currentUser
    .$relatedQuery('steps')
    .select('flow_id')
    .distinctOn('flow_id');

  if (params.appKey) {
    userStepsQuery.where('app_key', params.appKey);
  }

  const flowsQuery = context.currentUser
    .$relatedQuery('flows')
    .withGraphFetched('[steps.[connection]]')
    .whereIn(
      'flows.id',
      userStepsQuery
    );

  return paginate(flowsQuery, params.limit, params.offset);
};

export default getFlows;
