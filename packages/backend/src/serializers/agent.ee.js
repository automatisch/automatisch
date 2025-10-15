const agentSerializer = (agent) => {
  const agentData = {
    id: agent.id,
    name: agent.name,
    description: agent.description,
    instructions: agent.instructions,
    createdAt: agent.createdAt.getTime(),
    updatedAt: agent.updatedAt.getTime(),
  };

  return agentData;
};

export default agentSerializer;
