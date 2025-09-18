export default async (request, response) => {
  const mcpServer = await request.currentUser
    .$relatedQuery('mcpServers')
    .findOne({
      id: request.params.mcpServerId,
    })
    .throwIfNotFound();

  await mcpServer.delete();

  response.status(204).end();
};
