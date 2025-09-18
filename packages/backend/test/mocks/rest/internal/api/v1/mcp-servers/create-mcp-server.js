const createMcpServerMock = async (mcpServer) => {
  const data = {
    id: mcpServer.id,
    name: mcpServer.name,
    token: mcpServer.token,
    serverUrl: mcpServer.serverUrl,
    createdAt: mcpServer.createdAt.getTime(),
    updatedAt: mcpServer.updatedAt.getTime(),
  };

  return {
    data: data,
    meta: {
      count: 1,
      currentPage: null,
      isArray: false,
      totalPages: null,
      type: 'McpServer',
    },
  };
};

export default createMcpServerMock;
