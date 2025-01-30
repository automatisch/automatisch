export default async (request, response) => {
  const folder = await request.currentUser
    .$relatedQuery('folders')
    .findById(request.params.folderId)
    .throwIfNotFound();

  await folder.$query().delete();

  response.status(204).end();
};
