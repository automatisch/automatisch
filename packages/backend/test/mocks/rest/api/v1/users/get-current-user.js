const getCurrentUserMock = (currentUser, role) => {
  return {
    data: {
      createdAt: currentUser.createdAt.toISOString(),
      email: currentUser.email,
      fullName: currentUser.fullName,
      id: currentUser.id,
      permissions: [],
      role: {
        createdAt: role.createdAt.toISOString(),
        description: null,
        id: role.id,
        isAdmin: role.isAdmin,
        key: role.key,
        name: role.name,
        updatedAt: role.updatedAt.toISOString(),
      },
      roleId: role.id,
      trialExpiryDate: currentUser.trialExpiryDate.toISOString(),
      updatedAt: currentUser.updatedAt.toISOString(),
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
