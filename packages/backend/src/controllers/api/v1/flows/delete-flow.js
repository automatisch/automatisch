export default async (request, response) => {
  const flow = await request.currentUser.authorizedFlows
    .clone()
    .findById(request.params.flowId)
    .throwIfNotFound();

  await flow.delete();

  response.status(204).end();
};
