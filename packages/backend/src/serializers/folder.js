const folderSerilializer = (folder) => {
  return {
    id: folder.id,
    name: folder.name,
    createdAt: folder.createdAt.getTime(),
    updatedAt: folder.updatedAt.getTime(),
  };
};

export default folderSerilializer;
