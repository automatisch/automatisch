import Context from '../../types/express/context';

type Params = {
  id: string;
};

const getFlow = async (_parent: unknown, params: Params, context: Context) => {
  context.currentUser.can('read', 'Flow');

  const flow = await context.currentUser
    .$relatedQuery('flows')
    .withGraphJoined('[steps.[connection]]')
    .orderBy('steps.position', 'asc')
    .findOne({ 'flows.id': params.id })
    .throwIfNotFound();

  return flow;
};

export default getFlow;
