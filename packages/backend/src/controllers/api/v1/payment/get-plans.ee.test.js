import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../../../app.js';
import createAuthTokenByUserId from '../../../../helpers/create-auth-token-by-user-id.js';
import { createUser } from '../../../../../test/factories/user.js';
import getPaymentPlansMock from '../../../../../test/mocks/rest/api/v1/payment/get-plans.js';
import appConfig from '../../../../config/app.js';

describe('GET /api/v1/payment/plans', () => {
  let user, token;

  beforeEach(async () => {
    user = await createUser();
    token = await createAuthTokenByUserId(user.id);

    vi.spyOn(appConfig, 'isCloud', 'get').mockReturnValue(true);
  });

  it('should return payment plans', async () => {
    const response = await request(app)
      .get('/api/v1/payment/plans')
      .set('Authorization', token)
      .expect(200);

    const expectedResponsePayload = await getPaymentPlansMock();

    expect(response.body).toEqual(expectedResponsePayload);
  });
});
