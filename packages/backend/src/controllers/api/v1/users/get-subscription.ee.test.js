import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import appConfig from '../../../../config/app.js';
import app from '../../../../app.js';
import createAuthTokenByUserId from '../../../../helpers/create-auth-token-by-user-id';
import { createRole } from '../../../../../test/factories/role';
import { createUser } from '../../../../../test/factories/user';
import { createSubscription } from '../../../../../test/factories/subscription.js';
import getSubscriptionMock from '../../../../../test/mocks/rest/api/v1/users/get-subscription.js';

describe('GET /api/v1/users/:userId/subscription', () => {
  let currentUser, role, subscription, token;

  beforeEach(async () => {
    vi.spyOn(appConfig, 'isCloud', 'get').mockReturnValue(true);

    role = await createRole();

    currentUser = await createUser({
      roleId: role.id,
    });

    subscription = await createSubscription({ userId: currentUser.id });

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should return subscription info of the current user', async () => {
    const response = await request(app)
      .get(`/api/v1/users/${currentUser.id}/subscription`)
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = getSubscriptionMock(subscription);

    expect(response.body).toEqual(expectedPayload);
  });

  it('should return not found response if there is no current subscription', async () => {
    const userWithoutSubscription = await createUser({
      roleId: role.id,
    });

    const token = await createAuthTokenByUserId(userWithoutSubscription.id);

    await request(app)
      .get(`/api/v1/users/${userWithoutSubscription.id}/subscription`)
      .set('Authorization', token)
      .expect(404);
  });
});
