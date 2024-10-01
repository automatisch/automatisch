import { faker } from '@faker-js/faker';
import Identity from '../../src/models/identity.ee.js';
import { createUser } from './user.js';
import { createSamlAuthProvider } from './saml-auth-provider.ee.js';

export const createIdentity = async (params = {}) => {
  params.userId = params.userId || (await createUser()).id;
  params.remoteId = params.remoteId || faker.string.uuid();
  params.providerId = params.providerId || (await createSamlAuthProvider()).id;
  params.providerType = 'saml';

  const identity = await Identity.query().insertAndFetch(params);

  return identity;
};
