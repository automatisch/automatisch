const getAgentExecutionMock = async (agentExecution) => {
  const data = {
    id: agentExecution.id,
    agentId: agentExecution.agentId,
    prompt: agentExecution.prompt,
    status: agentExecution.status,
    output: agentExecution.output,
    createdAt: agentExecution.createdAt.getTime(),
    updatedAt: agentExecution.updatedAt.getTime(),
  };

  return {
    data,
    meta: {
      count: 1,
      currentPage: null,
      isArray: false,
      totalPages: null,
      type: 'AgentExecution',
    },
  };
};

export default getAgentExecutionMock;
