import { faker } from '@faker-js/faker';
import { createAppConfig } from './app-config.js';
import AppAuthClient from '../../src/models/app-auth-client';

const formattedAuthDefaults = {
  oAuthRedirectUrl: faker.internet.url(),
  instanceUrl: faker.internet.url(),
  clientId: faker.string.uuid(),
  clientSecret: faker.string.uuid(),
};

export const createAppAuthClient = async (params = {}) => {
  params.name = params?.name || faker.person.fullName();
  params.id = params?.id || faker.string.uuid();
  params.appConfigId = params?.appConfigId || (await createAppConfig()).id;
  params.active = params?.active ?? true;
  params.formattedAuthDefaults =
    params?.formattedAuthDefaults || formattedAuthDefaults;

  const appAuthClient = await AppAuthClient.query()
    .insert(params)
    .returning('*');

  return appAuthClient;
};
