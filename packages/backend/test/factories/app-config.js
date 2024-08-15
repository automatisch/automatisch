import AppConfig from '../../src/models/app-config.js';
import { faker } from '@faker-js/faker';

export const createAppConfig = async (params = {}) => {
  params.key = params?.key || faker.lorem.word();

  const appConfig = await AppConfig.query().insertAndFetch(params);

  return appConfig;
};
