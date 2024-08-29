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

export const createBulkConfig = async (params = {}) => {
  const updateQueries = Object.entries(params).map(([key, value]) => {
    const config = {
      key,
      value: { data: value },
    };

    return createConfig(config);
  });

  await Promise.all(updateQueries);

  return await Config.query().whereIn('key', Object.keys(params));
};

export const createInstallationCompletedConfig = async () => {
  return await createConfig({
    key: 'installation.completed',
    value: { data: true },
  });
};
