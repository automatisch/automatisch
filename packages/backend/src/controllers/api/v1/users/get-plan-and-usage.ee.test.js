import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../../../app.js';
import createAuthTokenByUserId from '../../../../helpers/create-auth-token-by-user-id.js';
import { createUser } from '../../../../../test/factories/user.js';
import { createSubscription } from '../../../../../test/factories/subscription.js';
import { createUsageData } from '../../../../../test/factories/usage-data.js';
import appConfig from '../../../../config/app.js';
import { DateTime } from 'luxon';

describe('GET /api/v1/users/:userId/plan-and-usage', () => {
  let user, token;

  beforeEach(async () => {
    const trialExpiryDate = DateTime.now().plus({ days: 30 }).toISODate();
    user = await createUser({ trialExpiryDate });
    token = await createAuthTokenByUserId(user.id);

    vi.spyOn(appConfig, 'isCloud', 'get').mockReturnValue(true);
  });

  it('should return free trial plan and usage data', async () => {
    const response = await request(app)
      .get(`/api/v1/users/${user.id}/plan-and-usage`)
      .set('Authorization', token)
      .expect(200);

    const expectedResponseData = {
      plan: {
        id: null,
        limit: null,
        name: 'Free Trial',
      },
      usage: {
        task: 0,
      },
    };

    expect(response.body.data).toEqual(expectedResponseData);
  });

  it('should return current plan and usage data', async () => {
    await createSubscription({ userId: user.id });

    await createUsageData({
      userId: user.id,
      consumedTaskCount: 1234,
    });

    const response = await request(app)
      .get(`/api/v1/users/${user.id}/plan-and-usage`)
      .set('Authorization', token)
      .expect(200);

    const expectedResponseData = {
      plan: {
        id: '47384',
        limit: '10,000',
        name: '10k - monthly',
      },
      usage: {
        task: 1234,
      },
    };

    expect(response.body.data).toEqual(expectedResponseData);
  });
});
