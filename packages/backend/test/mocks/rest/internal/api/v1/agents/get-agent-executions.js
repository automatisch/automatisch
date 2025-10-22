const getAgentExecutionsMock = async (agentExecutions) => {
  const data = agentExecutions.map((agentExecution) => ({
    id: agentExecution.id,
    agentId: agentExecution.agentId,
    prompt: agentExecution.prompt,
    status: agentExecution.status,
    output: agentExecution.output,
    createdAt: agentExecution.createdAt.getTime(),
    updatedAt: agentExecution.updatedAt.getTime(),
  }));

  return {
    data: data,
    meta: {
      count: data.length,
      currentPage: null,
      isArray: true,
      totalPages: null,
      type: 'AgentExecution',
    },
  };
};

export default getAgentExecutionsMock;
