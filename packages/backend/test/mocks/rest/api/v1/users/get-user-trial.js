const getUserTrialMock = async (currentUser) => {
  return {
    data: {
      inTrial: await currentUser.inTrial(),
      expireAt: currentUser.trialExpiryDate.toISOString(),
    },
    meta: {
      count: 1,
      currentPage: null,
      isArray: false,
      totalPages: null,
      type: 'Object',
    },
  };
};

export default getUserTrialMock;
