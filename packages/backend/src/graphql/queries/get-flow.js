import Flow from '../../models/flow.js';

const getFlow = async (_parent, params, context) => {
  const conditions = context.currentUser.can('read', 'Flow');
  const userFlows = context.currentUser.$relatedQuery('flows');
  const allFlows = Flow.query();
  const baseQuery = conditions.isCreator ? userFlows : allFlows;

  const flow = await baseQuery
    .clone()
    .withGraphJoined('[steps.[connection]]')
    .orderBy('steps.position', 'asc')
    .findOne({ 'flows.id': params.id })
    .throwIfNotFound();

  return flow;
};

export default getFlow;
