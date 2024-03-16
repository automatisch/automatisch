const appConfigSerializer = (appConfig) => {
  return {
    id: appConfig.id,
    key: appConfig.key,
    allowCustomConnection: appConfig.allowCustomConnection,
    shared: appConfig.shared,
    disabled: appConfig.disabled,
    canConnect: appConfig.canConnect,
    canCustomConnect: appConfig.canCustomConnect,
    createdAt: appConfig.createdAt.getTime(),
    updatedAt: appConfig.updatedAt.getTime(),
  };
};

export default appConfigSerializer;
