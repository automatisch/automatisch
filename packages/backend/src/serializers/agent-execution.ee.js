const agentExecutionSerializer = (agentExecution) => {
  const agentExecutionData = {
    id: agentExecution.id,
    agentId: agentExecution.agentId,
    prompt: agentExecution.prompt,
    output: agentExecution.output,
    status: agentExecution.status,
    finishedAt: agentExecution.finishedAt?.getTime(),
    createdAt: agentExecution.createdAt.getTime(),
    updatedAt: agentExecution.updatedAt.getTime(),
  };

  return agentExecutionData;
};

export default agentExecutionSerializer;
