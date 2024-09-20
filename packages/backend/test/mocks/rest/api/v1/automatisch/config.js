const configMock = (config) => {
  return {
    data: {
      disableFavicon: false,
      disableNotificationsPage: false,
      logoSvgData: config.logoSvgData,
      palettePrimaryDark: config.palettePrimaryDark,
      palettePrimaryMain: config.palettePrimaryMain,
      palettePrimaryLight: config.palettePrimaryLight,
      title: config.title,
    },
    meta: {
      count: 1,
      currentPage: null,
      isArray: false,
      totalPages: null,
      type: 'Object',
    },
  };
};

export default configMock;
