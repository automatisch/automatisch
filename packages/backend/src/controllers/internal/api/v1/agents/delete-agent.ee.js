export default async (request, response) => {
  const agent = await request.currentUser
    .$relatedQuery('agents')
    .findOne({
      id: request.params.agentId,
    })
    .throwIfNotFound();

  await agent.$query().delete();

  response.status(204).end();
};
