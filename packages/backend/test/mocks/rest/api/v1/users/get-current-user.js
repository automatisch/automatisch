const getCurrentUserMock = (currentUser, role, permissions) => {
  return {
    data: {
      createdAt: currentUser.createdAt.getTime(),
      email: currentUser.email,
      fullName: currentUser.fullName,
      id: currentUser.id,
      permissions: permissions.map((permission) => ({
        id: permission.id,
        roleId: permission.roleId,
        action: permission.action,
        subject: permission.subject,
        conditions: permission.conditions,
        createdAt: permission.createdAt.getTime(),
        updatedAt: permission.updatedAt.getTime(),
      })),
      role: {
        createdAt: role.createdAt.getTime(),
        description: null,
        id: role.id,
        isAdmin: role.isAdmin,
        key: role.key,
        name: role.name,
        updatedAt: role.updatedAt.getTime(),
      },
      status: currentUser.status,
      trialExpiryDate: currentUser.trialExpiryDate.toISOString(),
      updatedAt: currentUser.updatedAt.getTime(),
    },
    meta: {
      count: 1,
      currentPage: null,
      isArray: false,
      totalPages: null,
      type: 'User',
    },
  };
};

export default getCurrentUserMock;
