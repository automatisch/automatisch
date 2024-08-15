const getRoleMock = async (role, permissions) => {
  const data = {
    id: role.id,
    key: role.key,
    name: role.name,
    isAdmin: role.isAdmin,
    description: role.description,
    createdAt: role.createdAt.getTime(),
    updatedAt: role.updatedAt.getTime(),
    permissions: permissions.map((permission) => ({
      id: permission.id,
      action: permission.action,
      conditions: permission.conditions,
      roleId: permission.roleId,
      subject: permission.subject,
      createdAt: permission.createdAt.getTime(),
      updatedAt: permission.updatedAt.getTime(),
    })),
  };

  return {
    data: data,
    meta: {
      count: 1,
      currentPage: null,
      isArray: false,
      totalPages: null,
      type: 'Role',
    },
  };
};

export default getRoleMock;
