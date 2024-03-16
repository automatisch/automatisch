import { describe, it, expect, beforeEach } from 'vitest';
import { createSamlAuthProvider } from '../../test/factories/saml-auth-provider.ee.js';
import samlAuthProviderSerializer from './saml-auth-provider.ee.js';

describe('samlAuthProviderSerializer', () => {
  let samlAuthProvider;

  beforeEach(async () => {
    samlAuthProvider = await createSamlAuthProvider();
  });

  it('should return saml auth provider data', async () => {
    const expectedPayload = {
      id: samlAuthProvider.id,
      name: samlAuthProvider.name,
      loginUrl: samlAuthProvider.loginUrl,
      issuer: samlAuthProvider.issuer,
    };

    expect(samlAuthProviderSerializer(samlAuthProvider)).toEqual(
      expectedPayload
    );
  });
});
