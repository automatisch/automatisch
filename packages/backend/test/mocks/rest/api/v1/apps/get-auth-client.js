const getAppAuthClientMock = (appAuthClient) => {
  return {
    data: {
      name: appAuthClient.name,
      id: appAuthClient.id,
      appConfigId: appAuthClient.appConfigId,
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

export default getAppAuthClientMock;
