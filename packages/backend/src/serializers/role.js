const roleSerializer = (role) => {
  return {
    id: role.id,
    name: role.name,
    key: role.key,
    description: role.description,
    createdAt: role.createdAt,
    updatedAt: role.updatedAt,
    isAdmin: role.isAdmin,
  };
};

export default roleSerializer;
