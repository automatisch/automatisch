const createAppAuthClientMock = (appAuthClient) => {
  return {
    data: {
      name: appAuthClient.name,
      active: appAuthClient.active,
    },
    meta: {
      count: 1,
      currentPage: null,
      isArray: false,
      totalPages: null,
      type: 'AppAuthClient',
    },
  };
};

export default createAppAuthClientMock;
