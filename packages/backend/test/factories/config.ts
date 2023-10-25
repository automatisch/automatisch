import { IJSONObject } from '@automatisch/types';
import { faker } from '@faker-js/faker';

type ConfigParams = {
  key?: string;
  value?: IJSONObject;
};

export const createConfig = async (params: ConfigParams = {}) => {
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
