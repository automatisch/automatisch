import Context from '../../types/express/context';

type Params = {
  id: string;
};

const deleteConnection = async (
  _parent: unknown,
  params: Params,
  context: Context
) => {
  await context.currentUser
    .$relatedQuery('connections')
    .delete()
    .findOne({
      id: params.id,
    })
    .throwIfNotFound();

  return;
};

export default deleteConnection;
