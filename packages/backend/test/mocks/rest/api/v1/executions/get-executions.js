const getExecutionsMock = async (executions, flow, steps) => {
  const data = executions.map((execution) => ({
    id: execution.id,
    testRun: execution.testRun,
    createdAt: execution.createdAt.getTime(),
    updatedAt: execution.updatedAt.getTime(),
    status: 'success',
    flow: {
      id: flow.id,
      name: flow.name,
      active: flow.active,
      status: flow.active ? 'published' : 'draft',
      createdAt: flow.createdAt.getTime(),
      updatedAt: flow.updatedAt.getTime(),
      steps: steps.map((step) => ({
        id: step.id,
        type: step.type,
        key: step.key,
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
