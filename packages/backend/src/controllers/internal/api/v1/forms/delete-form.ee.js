export default async (request, response) => {
  const form = await request.currentUser
    .$relatedQuery('forms')
    .findOne({
      id: request.params.formId,
    })
    .throwIfNotFound();

  await form.$query().delete();

  response.status(204).end();
};
