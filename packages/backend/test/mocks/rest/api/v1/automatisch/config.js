const configMock = (config) => {
  return {
    data: {
      id: config.id,
      updatedAt: config.updatedAt.getTime(),
      createdAt: config.createdAt.getTime(),
      disableFavicon: false,
      disableNotificationsPage: false,
      logoSvgData: config.logoSvgData,
      palettePrimaryDark: config.palettePrimaryDark,
      palettePrimaryMain: config.palettePrimaryMain,
      palettePrimaryLight: config.palettePrimaryLight,
      installationCompleted: config.installationCompleted || false,
      title: config.title,
    },
    meta: {
      count: 1,
      currentPage: null,
      isArray: false,
      totalPages: null,
      type: 'Config',
    },
  };
};

export default configMock;
