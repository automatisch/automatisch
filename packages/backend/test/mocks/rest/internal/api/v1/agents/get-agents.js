const getAgentsMock = async (agents) => {
  const data = agents.map((agent) => ({
    id: agent.id,
    name: agent.name,
    description: agent.description,
    instructions: agent.instructions,
    createdAt: agent.createdAt.getTime(),
    updatedAt: agent.updatedAt.getTime(),
  }));

  return {
    data: data,
    meta: {
      count: data.length,
      currentPage: null,
      isArray: true,
      totalPages: null,
      type: 'Agent',
    },
  };
};

export default getAgentsMock;
