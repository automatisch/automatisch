import Context from '../../types/express/context';
import paginate from '../../helpers/pagination';

type Params = {
  appKey?: string;
  connectionId?: string;
  name?: string;
  limit: number;
  offset: number;
};

const getFlows = async (_parent: unknown, params: Params, context: Context) => {
  context.currentUser.can('read', 'Flow');

  const flowsQuery = context.currentUser
    .$relatedQuery('flows')
    .joinRelated({
      steps: true,
    })
    .withGraphFetched({
      steps: {
        connection: true,
      },
    })
    .where((builder) => {
      if (params.connectionId) {
        builder.where('steps.connection_id', params.connectionId);
      }

      if (params.name) {
        builder.where('flows.name', 'ilike', `%${params.name}%`);
      }

      if (params.appKey) {
        builder.where('steps.app_key', params.appKey);
      }
    })
    .groupBy('flows.id')
    .orderBy('active', 'desc')
    .orderBy('updated_at', 'desc');

  return paginate(flowsQuery, params.limit, params.offset);
};

export default getFlows;
