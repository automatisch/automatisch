import Context from '../../types/express/context';
import Flow from '../../models/flow';

type Params = {
  id: string;
};

const getFlow = async (_parent: unknown, params: Params, context: Context) => {
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
