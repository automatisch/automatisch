import Flow from '../../models/flow';
import paginate from '../../helpers/pagination';

const getFlows = async (_parent, params, context) => {
  const conditions = context.currentUser.can('read', 'Flow');
  const userFlows = context.currentUser.$relatedQuery('flows');
  const allFlows = Flow.query();
  const baseQuery = conditions.isCreator ? userFlows : allFlows;

  const flowsQuery = baseQuery
    .clone()
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
