const getAppMock = (app) => {
  return {
    data: {
      authDocUrl: app.authDocUrl,
      iconUrl: app.iconUrl,
      key: app.key,
      name: app.name,
      primaryColor: app.primaryColor,
      supportsConnections: app.supportsConnections,
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

export default getAppMock;
