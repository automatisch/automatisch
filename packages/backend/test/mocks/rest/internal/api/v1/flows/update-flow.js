const updateFlowMock = async (flow) => {
  const data = {
    id: flow.id,
    active: flow.active,
    name: flow.name,
    status: flow.status,
    executionInterval: flow.executionInterval,
    createdAt: flow.createdAt.getTime(),
    updatedAt: flow.updatedAt.getTime(),
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

export default updateFlowMock;
