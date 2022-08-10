import Context from '../../types/express/context';

type Params = {
  executionId: string;
};

const getExecution = async (
  _parent: unknown,
  params: Params,
  context: Context
) => {
  const execution = await context.currentUser
    .$relatedQuery('executions')
    .withGraphFetched({
      flow: {
        steps: true
      }
    })
    .findById(params.executionId);

  return execution;
};

export default getExecution;
