const getFlowMock = async (flow, steps) => {
  const data = {
    active: flow.active,
    id: flow.id,
    name: flow.name,
    status: flow.active ? 'published' : 'draft',
    createdAt: flow.createdAt.getTime(),
    updatedAt: flow.updatedAt.getTime(),
    steps: steps.map((step) => ({
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

  return {
    data: data,
    meta: {
      count: 1,
      currentPage: null,
      isArray: false,
      totalPages: null,
      type: 'Flow',
    },
  };
};

export default getFlowMock;
