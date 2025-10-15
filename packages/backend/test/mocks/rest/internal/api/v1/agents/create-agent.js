const createAgentMock = async (agent) => {
  const data = {
    id: agent.id,
    name: agent.name,
    description: agent.description,
    instructions: agent.instructions,
    createdAt: agent.createdAt.getTime(),
    updatedAt: agent.updatedAt.getTime(),
  };

  return {
    data: data,
    meta: {
      count: 1,
      currentPage: null,
      isArray: false,
      totalPages: null,
      type: 'Agent',
    },
  };
};

export default createAgentMock;
