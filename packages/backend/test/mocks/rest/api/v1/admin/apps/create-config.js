const createAppConfigMock = (appConfig) => {
  return {
    data: {
      key: appConfig.key,
      customConnectionAllowed: appConfig.customConnectionAllowed,
      shared: appConfig.shared,
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
