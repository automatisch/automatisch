import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import App from '../../../../models/app';
import app from '../../../../app.js';
import createAuthTokenByUserId from '../../../../helpers/create-auth-token-by-user-id';
import { createUser } from '../../../../../test/factories/user';
import getActionsMock from '../../../../../test/mocks/rest/api/v1/apps/get-actions.js';

describe('GET /api/v1/apps/:appKey/actions', () => {
  let currentUser, token;

  beforeEach(async () => {
    currentUser = await createUser();
    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should return the app actions', async () => {
    const exampleApp = await App.findOneByKey('github');

    const response = await request(app)
      .get(`/api/v1/apps/${exampleApp.key}/actions`)
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = getActionsMock(exampleApp.actions);
    expect(response.body).toEqual(expectedPayload);
  });

  it('should return not found response for invalid app key', async () => {
    await request(app)
      .get('/api/v1/apps/invalid-app-key/actions')
      .set('Authorization', token)
      .expect(404);
  });
});
