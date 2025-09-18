const getMcpToolExecutionsMock = (executions) => {
  const data = executions.map((execution) => ({
    id: execution.id,
    mcpToolId: execution.mcpToolId,
    status: execution.status,
    dataIn: execution.dataIn,
    dataOut: execution.dataOut,
    errorDetails: execution.errorDetails,
    createdAt: execution.createdAt.getTime(),
    updatedAt: execution.updatedAt.getTime(),
  }));

  return {
    data,
    meta: {
      count: data.length,
      currentPage: 1,
      isArray: true,
      totalPages: 1,
      type: data.length ? 'McpToolExecution' : 'Object',
    },
  };
};

export default getMcpToolExecutionsMock;
