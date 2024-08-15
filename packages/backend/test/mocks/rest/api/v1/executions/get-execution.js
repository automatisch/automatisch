const getExecutionMock = async (execution, flow, steps) => {
  const data = {
    id: execution.id,
    testRun: execution.testRun,
    createdAt: execution.createdAt.getTime(),
    updatedAt: execution.updatedAt.getTime(),
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
  };

  return {
    data: data,
    meta: {
      count: 1,
      currentPage: null,
      isArray: false,
      totalPages: null,
      type: 'Execution',
    },
  };
};

export default getExecutionMock;
