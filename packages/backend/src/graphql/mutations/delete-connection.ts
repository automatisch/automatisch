import Context from '../../types/express/context';

type Params = {
  input: {
    id: string;
  };
};

const deleteConnection = async (
  _parent: unknown,
  params: Params,
  context: Context
) => {
  context.currentUser.can('delete', 'Connection');

  await context.currentUser
    .$relatedQuery('connections')
    .delete()
    .findOne({
      id: params.input.id,
    })
    .throwIfNotFound();

  return;
};

export default deleteConnection;
