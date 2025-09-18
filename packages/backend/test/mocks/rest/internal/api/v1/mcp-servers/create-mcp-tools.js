const createMcpToolsMock = async (mcpTool) => {
  const data = {
    id: mcpTool.id,
    mcpServerId: mcpTool.mcpServerId,
    type: mcpTool.type,
    flowId: mcpTool.flowId,
    connectionId: mcpTool.connectionId,
    appKey: mcpTool.appKey,
    action: mcpTool.action,
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
