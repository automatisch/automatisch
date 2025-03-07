import appConfig from '../config/app.js';

export const generateIconUrl = (appKey) => {
  if (!appKey) return null;

  return `${appConfig.baseUrl}/apps/${appKey}/assets/favicon.svg`;
};
