import { faker } from '@faker-js/faker';

export const createConfig = async (params = {}) => {
  const configData = {
    key: params?.key || faker.lorem.word(),
    value: params?.value || { data: 'sampleConfig' },
  };

  const [config] = await global.knex
    .table('config')
    .insert(configData)
    .returning('*');

  return config;
};
