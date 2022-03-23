import Context from '../../types/express/context';

const getFlows = async (
  _parent: unknown,
  _params: unknown,
  context: Context
) => {
  const flows = await context.currentUser
    .$relatedQuery('flows')
    .withGraphJoined('[steps.[connection]]')
    .orderBy('created_at', 'desc');

  return flows;
};

export default getFlows;
