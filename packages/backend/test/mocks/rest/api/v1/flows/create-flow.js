const createFlowMock = async (flow) => {
  const data = {
    id: flow.id,
    active: flow.active,
    name: flow.name,
    status: flow.status,
    createdAt: flow.createdAt.getTime(),
    updatedAt: flow.updatedAt.getTime(),
    steps: [
      {
        position: 1,
        status: 'incomplete',
        type: 'trigger',
      },
      {
        position: 2,
        status: 'incomplete',
        type: 'action',
      },
    ],
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

export default createFlowMock;
