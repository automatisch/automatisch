const updateUserMock = (user, role) => {
  return {
    data: {
      createdAt: user.createdAt.getTime(),
      email: user.email,
      fullName: user.fullName,
      id: user.id,
      status: user.status,
      updatedAt: user.updatedAt.getTime(),
      role: {
        id: role.id,
        name: role.name,
        isAdmin: role.isAdmin,
        createdAt: role.createdAt.getTime(),
        updatedAt: role.updatedAt.getTime(),
      },
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

export default updateUserMock;
