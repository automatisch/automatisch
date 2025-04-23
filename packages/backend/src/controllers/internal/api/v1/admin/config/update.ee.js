import { renderObject } from '../../../../../../helpers/renderer.js';
import Config from '../../../../../../models/config.js';

export default async (request, response) => {
  const config = await Config.query().updateFirstOrInsert(
    configParams(request)
  );

  renderObject(response, config);
};

const configParams = (request) => {
  const {
    enableTemplates,
    enableFooter,
    footerBackgroundColor,
    footerCopyrightText,
    footerDocsUrl,
    footerImprintUrl,
    footerLogoSvgData,
    footerPrivacyPolicyUrl,
    footerTextColor,
    footerTosUrl,
    logoSvgData,
    palettePrimaryDark,
    palettePrimaryLight,
    palettePrimaryMain,
    title,
  } = request.body;

  return {
    enableTemplates,
    enableFooter,
    footerBackgroundColor,
    footerCopyrightText,
    footerDocsUrl,
    footerImprintUrl,
    footerLogoSvgData,
    footerPrivacyPolicyUrl,
    footerTextColor,
    footerTosUrl,
    logoSvgData,
    palettePrimaryDark,
    palettePrimaryLight,
    palettePrimaryMain,
    title,
  };
};
