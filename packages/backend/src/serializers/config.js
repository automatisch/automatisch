const configSerializer = (config) => {
  return {
    id: config.id,
    updatedAt: config.updatedAt.getTime(),
    createdAt: config.createdAt.getTime(),
    disableFavicon: config.disableFavicon,
    disableNotificationsPage: config.disableNotificationsPage,
    logoSvgData: config.logoSvgData,
    palettePrimaryDark: config.palettePrimaryDark,
    palettePrimaryMain: config.palettePrimaryMain,
    palettePrimaryLight: config.palettePrimaryLight,
    installationCompleted: config.installationCompleted,
    title: config.title,
  };
};

export default configSerializer;
