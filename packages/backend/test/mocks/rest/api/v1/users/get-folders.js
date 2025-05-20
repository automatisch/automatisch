const getFoldersMock = async (folders) => {
  const data = folders.map((folder) => {
    return {
      id: folder.id,
      name: folder.name,
      createdAt: folder.createdAt.getTime(),
      updatedAt: folder.updatedAt.getTime(),
    };
  });

  return {
    data: data,
    meta: {
      count: data.length,
      currentPage: null,
      isArray: true,
      totalPages: null,
      type: folders.length ? 'Folder' : 'Object',
    },
  };
};

export default getFoldersMock;
