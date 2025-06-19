const appSerializer = (app) => {
  let appData = {
    key: app.key,
    name: app.name,
    iconUrl: app.iconUrl,
    primaryColor: app.primaryColor,
    authDocUrl: app.authDocUrl,
    supportsConnections: app.supportsConnections,
    supportsOauthClients: app?.auth?.generateAuthUrl ? true : false,
  };

  if (app.connectionCount) {
    appData.connectionCount = app.connectionCount;
  }

  if (app.flowCount) {
    appData.flowCount = app.flowCount;
  }

  return appData;
};

export default appSerializer;
