import Context from '../../types/express/context';

type Params = {
  appKey?: string;
};

const getFlows = async (_parent: unknown, params: Params, context: Context) => {
  const flowsQuery = context.currentUser
    .$relatedQuery('flows')
    .withGraphJoined('[steps.[connection]]')
    .orderBy('created_at', 'desc');

  if (params.appKey) {
    flowsQuery.where('steps.app_key', params.appKey);
  }

  const flows = await flowsQuery;

  return flows;
};

export default getFlows;
