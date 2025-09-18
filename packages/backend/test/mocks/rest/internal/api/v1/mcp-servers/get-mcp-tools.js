const getMcpToolsMock = async (mcpTools) => {
  const data = mcpTools.map((mcpTool) => ({
    id: mcpTool.id,
    mcpServerId: mcpTool.mcpServerId,
    type: mcpTool.type,
    flowId: mcpTool.flowId,
    connectionId: mcpTool.connectionId,
    appKey: mcpTool.appKey,
    action: mcpTool.action,
    createdAt: mcpTool.createdAt.getTime(),
    updatedAt: mcpTool.updatedAt.getTime(),
  }));

  return {
    data: data,
    meta: {
      count: data.length,
      currentPage: null,
      isArray: true,
      totalPages: null,
      type: mcpTools.length ? 'McpTool' : 'Object',
    },
  };
};

export default getMcpToolsMock;
