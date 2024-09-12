const updateCurrentUserPasswordMock = (currentUser) => {
  return {
    data: {
      createdAt: currentUser.createdAt.getTime(),
      email: currentUser.email,
      fullName: currentUser.fullName,
      id: currentUser.id,
      status: currentUser.status,
      updatedAt: currentUser.updatedAt.getTime(),
      trialExpiryDate: currentUser.trialExpiryDate?.toISOString(),
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

export default updateCurrentUserPasswordMock;
