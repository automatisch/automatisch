import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../../../app.js';
import createAuthTokenByUserId from '../../../../helpers/create-auth-token-by-user-id.js';
import { createUser } from '../../../../../test/factories/user.js';
import getUserTrialMock from '../../../../../test/mocks/rest/api/v1/users/get-user-trial.js';
import appConfig from '../../../../config/app.js';
import { DateTime } from 'luxon';
import User from '../../../../models/user.js';

describe('GET /api/v1/users/:userId/trial', () => {
  let user, token;

  beforeEach(async () => {
    const trialExpiryDate = DateTime.now().plus({ days: 30 }).toISODate();
    user = await createUser({ trialExpiryDate });
    token = await createAuthTokenByUserId(user.id);

    vi.spyOn(appConfig, 'isCloud', 'get').mockReturnValue(true);
  });

  describe('should return in trial, active subscription and expire at info', () => {
    beforeEach(async () => {
      vi.spyOn(User.prototype, 'inTrial').mockResolvedValue(false);
      vi.spyOn(User.prototype, 'hasActiveSubscription').mockResolvedValue(true);
    });

    it('should return null', async () => {
      const response = await request(app)
        .get(`/api/v1/users/${user.id}/trial`)
        .set('Authorization', token)
        .expect(200);

      const expectedResponsePayload = await getUserTrialMock(user);
      expect(response.body).toEqual(expectedResponsePayload);
    });
  });
});
