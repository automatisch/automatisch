import Context from '../../types/express/context';
import paginate from '../../helpers/pagination';

type Params = {
  appKey?: string;
  limit: number;
  offset: number;
};

const getFlows = async (_parent: unknown, params: Params, context: Context) => {
  const flowsQuery = context.currentUser
    .$relatedQuery('flows')
    .joinRelated('steps')
    .withGraphFetched('steps.[connection]')
    .where((builder) => {
      if (params.appKey) {
        builder.where('steps.app_key', params.appKey);
      }
    })
    .orderBy('updated_at', 'desc');

  return paginate(flowsQuery, params.limit, params.offset);
};

export default getFlows;
