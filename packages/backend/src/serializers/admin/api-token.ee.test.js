import { describe, it, expect, beforeEach } from 'vitest';
import adminApiTokenSerializer from '@/serializers/admin/api-token.ee.js';
import { createApiToken } from '@/factories/api-token.js';

describe('adminApiTokenSerializer', () => {
  let apiToken;

  beforeEach(async () => {
    apiToken = await createApiToken();
  });

  it('should return api token data', async () => {
    const expectedPayload = {
      id: apiToken.id,
      token:
        apiToken.token.substring(0, 4) +
        '...' +
        apiToken.token.substring(apiToken.token.length - 4),
      createdAt: apiToken.createdAt.getTime(),
      updatedAt: apiToken.updatedAt.getTime(),
    };

    expect(adminApiTokenSerializer(apiToken)).toStrictEqual(expectedPayload);
  });
});
