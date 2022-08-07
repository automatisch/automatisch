import Context from '../../types/express/context';
import paginate from '../../helpers/pagination';

type Params = {
  appKey?: string;
  name?: string;
  limit: number;
  offset: number;
};

const getFlows = async (_parent: unknown, params: Params, context: Context) => {
  const flowsQuery = context.currentUser
    .$relatedQuery('flows')
    .joinRelated('steps')
    .withGraphFetched('steps.[connection]')
    .where((builder) => {
      if (params.name) {
        builder.where('flows.name', 'like', `%${params.name}%`);
      }

      if (params.appKey) {
        builder.where('steps.app_key', params.appKey);
      }
    })
    .groupBy('flows.id')
    .orderBy('updated_at', 'desc');

  return paginate(flowsQuery, params.limit, params.offset);
};

export default getFlows;
