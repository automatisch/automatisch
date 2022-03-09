import Context from '../../types/express/context';

const getExecutions = async (
  _parent: unknown,
  _params: unknown,
  context: Context
) => {
  const executions = await context.currentUser
    .$relatedQuery('executions')
    .withGraphFetched('flow')
    .orderBy('created_at', 'asc');

  return executions;
};

export default getExecutions;
