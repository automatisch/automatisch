const updateFolderMock = async (folder) => {
  const data = {
    id: folder.id,
    name: folder.name,
    createdAt: folder.createdAt.getTime(),
    updatedAt: folder.updatedAt.getTime(),
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
