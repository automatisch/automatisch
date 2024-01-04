const deleteConnection = async (_parent, params, context) => {
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
