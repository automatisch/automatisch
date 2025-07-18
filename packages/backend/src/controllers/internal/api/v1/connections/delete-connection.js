export default async (request, response) => {
  await request.currentUser.manageableConnections
    .clone()
    .delete()
    .findOne({
      id: request.params.connectionId,
    })
    .throwIfNotFound();

  response.status(204).end();
};
