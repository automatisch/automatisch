import { faker } from '@faker-js/faker';
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
  params.appKey = params?.appKey || 'deepl';
  params.active = params?.active ?? true;
  params.formattedAuthDefaults =
    params?.formattedAuthDefaults || formattedAuthDefaults;

  const appAuthClient = await AppAuthClient.query().insertAndFetch(params);

  return appAuthClient;
};
