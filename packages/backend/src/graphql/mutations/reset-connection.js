const resetConnection = async (_parent, params, context) => {
  context.currentUser.can('create', 'Connection');

  let connection = await context.currentUser
    .$relatedQuery('connections')
    .findOne({
      id: params.input.id,
    })
    .throwIfNotFound();

  if (!connection.formattedData) {
    return null;
  }

  connection = await connection.$query().patchAndFetch({
    formattedData: { screenName: connection.formattedData.screenName },
  });

  return connection;
};

export default resetConnection;
