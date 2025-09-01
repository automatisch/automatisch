const mcpToolSerializer = (mcpTool) => {
  const mcpToolData = {
    id: mcpTool.id,
    mcpServerId: mcpTool.mcpServerId,
    type: mcpTool.type,
    flowId: mcpTool.flowId,
    connectionId: mcpTool.connectionId,
    appKey: mcpTool.appKey,
    actions: mcpTool.actions,
    createdAt: mcpTool.createdAt.getTime(),
    updatedAt: mcpTool.updatedAt.getTime(),
  };

  return mcpToolData;
};

export default mcpToolSerializer;
