const mcpToolExecutionSerializer = (mcpToolExecution) => {
  const mcpToolExecutionData = {
    id: mcpToolExecution.id,
    mcpToolId: mcpToolExecution.mcpToolId,
    status: mcpToolExecution.status,
    dataIn: mcpToolExecution.dataIn,
    dataOut: mcpToolExecution.dataOut,
    errorDetails: mcpToolExecution.errorDetails,
    createdAt: mcpToolExecution.createdAt.getTime(),
    updatedAt: mcpToolExecution.updatedAt.getTime(),
  };

  return mcpToolExecutionData;
};

export default mcpToolExecutionSerializer;
