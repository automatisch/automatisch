const appConfigSerializer = (appConfig) => {
  return {
    id: appConfig.id,
    key: appConfig.key,
    customConnectionAllowed: appConfig.customConnectionAllowed,
    shared: appConfig.shared,
    disabled: appConfig.disabled,
    connectionAllowed: appConfig.connectionAllowed,
    createdAt: appConfig.createdAt.getTime(),
    updatedAt: appConfig.updatedAt.getTime(),
  };
};

export default appConfigSerializer;
