const updateConfigMock = (
  logoConfig,
  primaryDarkConfig,
  primaryLightConfig,
  primaryMainConfig,
  titleConfig
) => {
  return {
    data: {
      'logo.svgData': logoConfig,
      'palette.primary.dark': primaryDarkConfig,
      'palette.primary.light': primaryLightConfig,
      'palette.primary.main': primaryMainConfig,
      title: titleConfig,
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

export default updateConfigMock;
