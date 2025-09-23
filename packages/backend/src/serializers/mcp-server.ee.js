const mcpServerSerializer = (mcpServer) => {
  const mcpServerData = {
    id: mcpServer.id,
    name: mcpServer.name,
    token: mcpServer.token,
    serverUrl: mcpServer.serverUrl,
    createdAt: mcpServer.createdAt.getTime(),
    updatedAt: mcpServer.updatedAt.getTime(),
  };

  return mcpServerData;
};

export default mcpServerSerializer;
