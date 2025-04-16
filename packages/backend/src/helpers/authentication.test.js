import { describe, it, expect } from 'vitest';
import { isAuthenticated, isApiTokenAuthenticated } from './authentication.js';
import { createUser } from '../../test/factories/user.js';
import { createApiToken } from '../../test/factories/api-token.js';
import createAuthTokenByUserId from '../helpers/create-auth-token-by-user-id.js';

describe('isAuthenticated', () => {
  it('should return false if no token is provided', async () => {
    const req = { headers: {} };
    expect(await isAuthenticated(req)).toBe(false);
  });

  it('should return false if token is invalid', async () => {
    const req = { headers: { authorization: 'invalidToken' } };
    expect(await isAuthenticated(req)).toBe(false);
  });

  it('should return true if token is valid and there is a user', async () => {
    const user = await createUser();
    const token = await createAuthTokenByUserId(user.id);

    const req = { headers: { authorization: token } };
    expect(await isAuthenticated(req)).toBe(true);
  });

  it('should return false if token is valid and but there is no user', async () => {
    const user = await createUser();
    const token = await createAuthTokenByUserId(user.id);
    await user.$query().delete();

    const req = { headers: { authorization: token } };
    expect(await isAuthenticated(req)).toBe(false);
  });
});

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
