const getAppsMock = (apps) => {
  const appsData = apps.map((app) => ({
    authDocUrl: app.authDocUrl,
    iconUrl: app.iconUrl,
    key: app.key,
    name: app.name,
    primaryColor: app.primaryColor,
    supportsConnections: app.supportsConnections,
    supportsOauthClients: app?.auth?.generateAuthUrl ? true : false,
  }));

  return {
    data: appsData,
    meta: {
      count: appsData.length,
      currentPage: null,
      isArray: true,
      totalPages: null,
      type: 'Object',
    },
  };
};

export default getAppsMock;
