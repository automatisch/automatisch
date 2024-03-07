import AppConfig from '../../src/models/app-config.js';

export const createAppConfig = async (params = {}) => {
  params.key = params?.key || 'gitlab';

  const appConfig = await AppConfig.query().insert(params).returning('*');

  return appConfig;
};
