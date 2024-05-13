import { faker } from '@faker-js/faker';
import Config from '../../src/models/config';

export const createConfig = async (params = {}) => {
  const configData = {
    key: params?.key || faker.lorem.word(),
    value: params?.value || { data: 'sampleConfig' },
  };

  const config = await Config.query().insertAndFetch(configData);

  return config;
};

export const createInstallationCompletedConfig = async () => {
  return await createConfig({ key: 'installation.completed', value: { data: true } });
}
