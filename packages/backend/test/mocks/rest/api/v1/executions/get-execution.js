const getExecutionMock = async (execution, flow) => {
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
