const getAppConfigMock = (appConfig) => {
  return {
    data: {
      id: appConfig.id,
      key: appConfig.key,
      customConnectionAllowed: appConfig.customConnectionAllowed,
      shared: appConfig.shared,
      disabled: appConfig.disabled,
      connectionAllowed: appConfig.connectionAllowed,
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
