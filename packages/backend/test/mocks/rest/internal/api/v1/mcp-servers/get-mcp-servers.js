const getMcpServersMock = async (mcpServers) => {
  const data = mcpServers.map((mcpServer) => ({
    id: mcpServer.id,
    name: mcpServer.name,
    token: mcpServer.token,
    serverUrl: mcpServer.serverUrl,
    createdAt: mcpServer.createdAt.getTime(),
    updatedAt: mcpServer.updatedAt.getTime(),
  }));

  return {
    data: data,
    meta: {
      count: data.length,
      currentPage: null,
      isArray: true,
      totalPages: null,
      type: mcpServers.length ? 'McpServer' : 'Object',
    },
  };
};

export default getMcpServersMock;
