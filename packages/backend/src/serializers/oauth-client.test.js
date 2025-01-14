import { describe, it, expect, beforeEach } from 'vitest';
import { createOAuthClient } from '../../test/factories/oauth-client';
import oauthClientSerializer from './oauth-client';

describe('oauthClient serializer', () => {
  let oauthClient;

  beforeEach(async () => {
    oauthClient = await createOAuthClient();
  });

  it('should return oauth client data', async () => {
    const expectedPayload = {
      id: oauthClient.id,
      appConfigId: oauthClient.appConfigId,
      name: oauthClient.name,
      active: oauthClient.active,
    };

    expect(oauthClientSerializer(oauthClient)).toStrictEqual(expectedPayload);
  });
});
