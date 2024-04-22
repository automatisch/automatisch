import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../../../app.js';
import createAuthTokenByUserId from '../../../../helpers/create-auth-token-by-user-id.js';
import { createUser } from '../../../../../test/factories/user.js';
import getPaddleInfoMock from '../../../../../test/mocks/rest/api/v1/payment/get-paddle-info.js';
import appConfig from '../../../../config/app.js';
import billing from '../../../../helpers/billing/index.ee.js';

describe('GET /api/v1/payment/paddle-info', () => {
  let user, token;

  beforeEach(async () => {
    user = await createUser();
    token = await createAuthTokenByUserId(user.id);

    vi.spyOn(appConfig, 'isCloud', 'get').mockReturnValue(true);
    vi.spyOn(billing.paddleInfo, 'vendorId', 'get').mockReturnValue(
      'sampleVendorId'
    );
  });

  it('should return payment plans', async () => {
    const response = await request(app)
      .get('/api/v1/payment/paddle-info')
      .set('Authorization', token)
      .expect(200);

    const expectedResponsePayload = await getPaddleInfoMock();

    expect(response.body).toEqual(expectedResponsePayload);
  });
});
