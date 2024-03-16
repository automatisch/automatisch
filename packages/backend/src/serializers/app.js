const appSerializer = (app) => {
  return {
    name: app.name,
    key: app.key,
    iconUrl: app.iconUrl,
    authDocUrl: app.authDocUrl,
    supportsConnections: app.supportsConnections,
    primaryColor: app.primaryColor,
  };
};

export default appSerializer;
