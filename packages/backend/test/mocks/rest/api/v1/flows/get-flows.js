const getFlowsMock = async (flows, steps) => {
  const data = flows.map((flow) => {
    const flowSteps = steps.filter((step) => step.flowId === flow.id);

    return {
      active: flow.active,
      id: flow.id,
      name: flow.name,
      status: flow.active ? 'published' : 'draft',
      createdAt: flow.createdAt.getTime(),
      updatedAt: flow.updatedAt.getTime(),
      steps: flowSteps.map((step) => ({
        appKey: step.appKey,
        iconUrl: step.iconUrl,
        id: step.id,
        key: step.key,
        parameters: step.parameters,
        position: step.position,
        status: step.status,
        type: step.type,
        webhookUrl: step.webhookUrl,
      })),
    };
  });

  return {
    data: data,
    meta: {
      count: data.length,
      currentPage: 1,
      isArray: true,
      totalPages: 1,
      type: 'Flow',
    },
  };
};

export default getFlowsMock;
