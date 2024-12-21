const createAppConfigMock = (appConfig) => {
  return {
    data: {
      key: appConfig.key,
      useOnlyPredefinedAuthClients: appConfig.useOnlyPredefinedAuthClients,
      disabled: appConfig.disabled,
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

export default createAppConfigMock;
