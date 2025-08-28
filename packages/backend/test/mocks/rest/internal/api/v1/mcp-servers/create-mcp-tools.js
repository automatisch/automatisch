const createMcpToolsMock = async (mcpTool) => {
  const data = {
    id: mcpTool.id,
    serverId: mcpTool.serverId,
    type: mcpTool.type,
    flowId: mcpTool.flowId,
    connectionId: mcpTool.connectionId,
    appKey: mcpTool.appKey,
    actions: mcpTool.actions,
    createdAt: mcpTool.createdAt.getTime(),
    updatedAt: mcpTool.updatedAt.getTime(),
  };

  return {
    data: data,
    meta: {
      count: 1,
      currentPage: null,
      isArray: false,
      totalPages: null,
      type: 'McpTool',
    },
  };
};

export default createMcpToolsMock;
