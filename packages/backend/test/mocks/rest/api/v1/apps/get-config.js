const getAppConfigMock = (appConfig) => {
  return {
    data: {
      id: appConfig.id,
      key: appConfig.key,
      allowCustomConnection: appConfig.allowCustomConnection,
      shared: appConfig.shared,
      disabled: appConfig.disabled,
      connectionAllowed: appConfig.connectionAllowed,
      canCustomConnect: appConfig.canCustomConnect,
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
