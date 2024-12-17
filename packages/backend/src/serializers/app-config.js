const appConfigSerializer = (appConfig) => {
  return {
    key: appConfig.key,
    useOnlyPredefinedAuthClients: appConfig.useOnlyPredefinedAuthClients,
    disabled: appConfig.disabled,
    createdAt: appConfig.createdAt.getTime(),
    updatedAt: appConfig.updatedAt.getTime(),
  };
};

export default appConfigSerializer;
