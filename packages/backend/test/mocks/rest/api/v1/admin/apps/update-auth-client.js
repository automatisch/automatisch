const updateAppAuthClientMock = (appAuthClient) => {
  return {
    data: {
      id: appAuthClient.id,
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

export default updateAppAuthClientMock;
