import appConfig from '../../../../../../../src/config/app.js';

const registerUserMock = (user) => {
  const userData = {
    createdAt: user.createdAt.getTime(),
    email: user.email,
    fullName: user.fullName,
    id: user.id,
    status: user.status,
    updatedAt: user.updatedAt.getTime(),
  };

  if (appConfig.isCloud && user.trialExpiryDate) {
    userData.trialExpiryDate = user.trialExpiryDate.toISOString();
  }

  return {
    data: userData,
    meta: {
      count: 1,
      currentPage: null,
      isArray: false,
      totalPages: null,
      type: 'User',
    },
  };
};

export default registerUserMock;
