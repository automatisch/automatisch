const getExecutionsMock = async (executions) => {
  const data = executions.map((execution) => ({
    id: execution.id,
    testRun: execution.testRun,
    createdAt: execution.createdAt.getTime(),
    updatedAt: execution.updatedAt.getTime(),
    status: 'success',
    flow: {
      id: execution.flow.id,
      name: execution.flow.name,
      active: execution.flow.active,
      status: execution.flow.active ? 'published' : 'draft',
      createdAt: execution.flow.createdAt.getTime(),
      updatedAt: execution.flow.updatedAt.getTime(),
      steps: execution.flow.steps.map((step) => ({
        id: step.id,
        type: step.type,
        key: step.key,
        name: step.name,
        appKey: step.appKey,
        iconUrl: step.iconUrl,
        webhookUrl: step.webhookUrl,
        status: step.status,
        position: step.position,
        parameters: step.parameters,
      })),
    },
  }));

  return {
    data: data,
    meta: {
      count: executions.length,
      currentPage: 1,
      isArray: true,
      totalPages: 1,
      type: 'Execution',
    },
  };
};

export default getExecutionsMock;
