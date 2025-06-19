const configMock = (config) => {
  return {
    data: {
      id: config.id,
      updatedAt: config.updatedAt.getTime(),
      createdAt: config.createdAt.getTime(),
      disableFavicon: config.disableFavicon,
      disableNotificationsPage: config.disableNotificationsPage,
      additionalDrawerLink: config.additionalDrawerLink,
      additionalDrawerLinkIcon: config.additionalDrawerLinkIcon,
      additionalDrawerLinkText: config.additionalDrawerLinkText,
      logoSvgData: config.logoSvgData,
      palettePrimaryDark: config.palettePrimaryDark,
      palettePrimaryMain: config.palettePrimaryMain,
      palettePrimaryLight: config.palettePrimaryLight,
      installationCompleted: config.installationCompleted || false,
      title: config.title,
      enableTemplates: config.enableTemplates,
      enableFooter: config.enableFooter || false,
      footerLogoSvgData: config.footerLogoSvgData,
      footerCopyrightText: config.footerCopyrightText,
      footerBackgroundColor: config.footerBackgroundColor,
      footerTextColor: config.footerTextColor,
      footerDocsUrl: config.footerDocsUrl,
      footerTosUrl: config.footerTosUrl,
      footerPrivacyPolicyUrl: config.footerPrivacyPolicyUrl,
      footerImprintUrl: config.footerImprintUrl,
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
