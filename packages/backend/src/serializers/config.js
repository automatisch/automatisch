const configSerializer = (config) => {
  return {
    id: config.id,
    updatedAt: config.updatedAt.getTime(),
    createdAt: config.createdAt.getTime(),
    disableFavicon: config.disableFavicon,
    disableNotificationsPage: config.disableNotificationsPage,
    enableTemplates: config.enableTemplates,
    additionalDrawerLink: config.additionalDrawerLink,
    additionalDrawerLinkIcon: config.additionalDrawerLinkIcon,
    additionalDrawerLinkText: config.additionalDrawerLinkText,
    logoSvgData: config.logoSvgData,
    palettePrimaryDark: config.palettePrimaryDark,
    palettePrimaryMain: config.palettePrimaryMain,
    palettePrimaryLight: config.palettePrimaryLight,
    installationCompleted: config.installationCompleted,
    title: config.title,
    enableFooter: config.enableFooter,
    footerLogoSvgData: config.footerLogoSvgData,
    footerCopyrightText: config.footerCopyrightText,
    footerBackgroundColor: config.footerBackgroundColor,
    footerTextColor: config.footerTextColor,
    footerDocsUrl: config.footerDocsUrl,
    footerTosUrl: config.footerTosUrl,
    footerPrivacyPolicyUrl: config.footerPrivacyPolicyUrl,
    footerImprintUrl: config.footerImprintUrl,
  };
};

export default configSerializer;
