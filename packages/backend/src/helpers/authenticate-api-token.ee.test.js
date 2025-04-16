import { describe, it, expect } from 'vitest';
import { isApiTokenAuthenticated } from './authenticate-api-token.ee.js';
import { createApiToken } from '../../test/factories/api-token.js';

describe('isApiTokenAuthenticated', () => {
  it('should return false if no token is provided', async () => {
    const req = { headers: {} };
    expect(await isApiTokenAuthenticated(req)).toBe(false);
  });

  it('should return false if token is invalid', async () => {
    const req = { headers: { 'x-api-token': 'invalidToken' } };
    expect(await isApiTokenAuthenticated(req)).toBe(false);
  });

  it('should return true if token is valid', async () => {
    const apiToken = await createApiToken();

    const req = { headers: { 'x-api-token': apiToken.token } };
    expect(await isApiTokenAuthenticated(req)).toBe(true);
  });
});
