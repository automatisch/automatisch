const infoMock = (
  logoConfig,
  primaryDarkConfig,
  primaryLightConfig,
  primaryMainConfig,
  titleConfig
) => {
  return {
    data: {
      disableFavicon: false,
      disableNotificationsPage: false,
      'logo.svgData': logoConfig.value.data,
      'palette.primary.dark': primaryDarkConfig.value.data,
      'palette.primary.light': primaryLightConfig.value.data,
      'palette.primary.main': primaryMainConfig.value.data,
      title: titleConfig.value.data,
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

export default infoMock;
