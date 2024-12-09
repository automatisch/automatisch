const getAppConfigMock = (appConfig) => {
  return {
    data: {
      key: appConfig.key,
      useOnlyPredefinedAuthClients: appConfig.useOnlyPredefinedAuthClients,
      disabled: appConfig.disabled,
      createdAt: appConfig.createdAt.getTime(),
      updatedAt: appConfig.updatedAt.getTime(),
    },
    meta: {
      count: 1,
      currentPage: null,
      isArray: false,
      totalPages: null,
      type: 'AppConfig',
    },
  };
};

export default getAppConfigMock;
