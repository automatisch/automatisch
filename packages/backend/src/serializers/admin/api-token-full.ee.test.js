import { describe, it, expect, beforeEach } from 'vitest';
import adminApiTokenFullSerializer from './api-token-full.ee.js';
import { createApiToken } from '../../../test/factories/api-token.js';

describe('adminApiTokenFullSerializer', () => {
  let apiToken;

  beforeEach(async () => {
    apiToken = await createApiToken();
  });

  it('should return api token data', async () => {
    const expectedPayload = {
      id: apiToken.id,
      token: apiToken.token,
      createdAt: apiToken.createdAt.getTime(),
      updatedAt: apiToken.updatedAt.getTime(),
    };

    expect(adminApiTokenFullSerializer(apiToken)).toStrictEqual(
      expectedPayload
    );
  });
});
