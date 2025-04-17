import { faker } from '@faker-js/faker';
import OAuthClient from '../../src/models/oauth-client.js';

const formattedAuthDefaults = {
  oAuthRedirectUrl: faker.internet.url(),
  instanceUrl: faker.internet.url(),
  clientId: faker.string.uuid(),
  clientSecret: faker.string.uuid(),
};

export const createOAuthClient = async (params = {}) => {
  params.name = params?.name || faker.person.fullName();
  params.appKey = params?.appKey || 'deepl';
  params.active = params?.active ?? true;
  params.formattedAuthDefaults =
    params?.formattedAuthDefaults || formattedAuthDefaults;

  const oauthClient = await OAuthClient.query().insertAndFetch(params);

  return oauthClient;
};
