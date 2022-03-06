import Context from '../../types/express/context';

type Params = {
  id: string;
};

const deleteFlow = async (
  _parent: unknown,
  params: Params,
  context: Context
) => {
  await context.currentUser
    .$relatedQuery('flows')
    .delete()
    .findOne({
      id: params.id,
    })
    .throwIfNotFound();

  return;
};

export default deleteFlow;
