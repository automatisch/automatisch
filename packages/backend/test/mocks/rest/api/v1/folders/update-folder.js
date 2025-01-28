const updateFolderMock = async (flow) => {
  const data = {
    id: flow.id,
    name: flow.name,
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
      type: 'Folder',
    },
  };
};

export default updateFolderMock;
