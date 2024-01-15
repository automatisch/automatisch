import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../app';
import User from '../../models/user';
import { createUser } from '../../../test/factories/user';
import createAuthTokenByUserId from '../../helpers/create-auth-token-by-user-id';
import { DateTime } from 'luxon';
import appConfig from '../../config/app';

describe('graphQL getTrialStatus query', () => {
  const query = `
    query GetTrialStatus {
      getTrialStatus {
        expireAt
      }
    }
  `;

  let user, userToken;

  beforeEach(async () => {
    const trialExpiryDate = DateTime.now().plus({ days: 30 }).toISODate();

    user = await createUser({ trialExpiryDate });
    userToken = createAuthTokenByUserId(user.id);
  });

  describe('and with cloud flag disabled', () => {
    beforeEach(async () => {
      vi.spyOn(appConfig, 'isCloud', 'get').mockReturnValue(false);
    });

    it('should return null', async () => {
      const response = await request(app)
        .post('/graphql')
        .set('Authorization', userToken)
        .send({ query })
        .expect(200);

      const expectedResponsePayload = {
        data: { getTrialStatus: null },
      };

      expect(response.body).toEqual(expectedResponsePayload);
    });
  });

  describe('and with cloud flag enabled', () => {
    beforeEach(async () => {
      vi.spyOn(appConfig, 'isCloud', 'get').mockReturnValue(true);
    });

    describe('and not in trial and has active subscription', () => {
      beforeEach(async () => {
        vi.spyOn(User.prototype, 'inTrial').mockResolvedValue(false);
        vi.spyOn(User.prototype, 'hasActiveSubscription').mockResolvedValue(
          true
        );
      });

      it('should return null', async () => {
        const response = await request(app)
          .post('/graphql')
          .set('Authorization', userToken)
          .send({ query })
          .expect(200);

        const expectedResponsePayload = {
          data: { getTrialStatus: null },
        };

        expect(response.body).toEqual(expectedResponsePayload);
      });
    });

    describe('and in trial period', () => {
      beforeEach(async () => {
        vi.spyOn(User.prototype, 'inTrial').mockResolvedValue(true);
      });

      it('should return null', async () => {
        const response = await request(app)
          .post('/graphql')
          .set('Authorization', userToken)
          .send({ query })
          .expect(200);

        const expectedResponsePayload = {
          data: {
            getTrialStatus: {
              expireAt: new Date(user.trialExpiryDate).getTime().toString(),
            },
          },
        };

        expect(response.body).toEqual(expectedResponsePayload);
      });
    });
  });
});
