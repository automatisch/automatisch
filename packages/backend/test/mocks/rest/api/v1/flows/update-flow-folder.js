const updateFlowFolderMock = async (flow, folder) => {
  const data = {
    active: flow.active,
    id: flow.id,
    name: flow.name,
    status: flow.active ? 'published' : 'draft',
    createdAt: flow.createdAt.getTime(),
    updatedAt: flow.updatedAt.getTime(),
    folder: {
      id: folder.id,
      name: folder.name,
      createdAt: folder.createdAt.getTime(),
      updatedAt: folder.updatedAt.getTime(),
    },
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

export default updateFlowFolderMock;
