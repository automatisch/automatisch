export default async (request, response) => {
  await request.currentUser
    .$relatedQuery('connections')
    .delete()
    .findOne({
      id: request.params.connectionId,
    })
    .throwIfNotFound();

  response.status(204).end();
};
