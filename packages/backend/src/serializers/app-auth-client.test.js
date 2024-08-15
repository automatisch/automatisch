import { describe, it, expect, beforeEach } from 'vitest';
import { createAppAuthClient } from '../../test/factories/app-auth-client';
import appAuthClientSerializer from './app-auth-client';

describe('appAuthClient serializer', () => {
  let appAuthClient;

  beforeEach(async () => {
    appAuthClient = await createAppAuthClient();
  });

  it('should return app auth client data', async () => {
    const expectedPayload = {
      id: appAuthClient.id,
      appConfigId: appAuthClient.appConfigId,
      name: appAuthClient.name,
      active: appAuthClient.active,
    };

    expect(appAuthClientSerializer(appAuthClient)).toEqual(expectedPayload);
  });
});
