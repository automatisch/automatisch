import AppConfig from '../../src/models/app-config.js';

export const createAppConfig = async (params = {}) => {
  const appConfigData = {
    key: params?.key || 'gitlab',
  };

  const appConfig = await AppConfig.query()
    .insert(appConfigData)
    .returning('*');

  return appConfig;
};
