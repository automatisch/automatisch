import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import App from '../../../../models/app';
import app from '../../../../app.js';
import createAuthTokenByUserId from '../../../../helpers/create-auth-token-by-user-id';
import { createUser } from '../../../../../test/factories/user';
import getAppsMock from '../../../../../test/mocks/rest/api/v1/apps/get-apps.js';

describe('GET /api/v1/apps', () => {
  let currentUser, apps, token;

  beforeEach(async () => {
    currentUser = await createUser();
    token = await createAuthTokenByUserId(currentUser.id);
    apps = await App.findAll();
  });

  it('should return all apps', async () => {
    const response = await request(app)
      .get('/api/v1/apps')
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = getAppsMock(apps);
    expect(response.body).toEqual(expectedPayload);
  });

  it('should return all apps filtered by name', async () => {
    const appsWithNameGit = apps.filter((app) => app.name.includes('Git'));

    const response = await request(app)
      .get('/api/v1/apps?name=Git')
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = getAppsMock(appsWithNameGit);
    expect(response.body).toEqual(expectedPayload);
  });

  it('should return only the apps with triggers', async () => {
    const appsWithTriggers = apps.filter((app) => app.triggers?.length > 0);

    const response = await request(app)
      .get('/api/v1/apps?onlyWithTriggers=true')
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = getAppsMock(appsWithTriggers);
    expect(response.body).toEqual(expectedPayload);
  });

  it('should return only the apps with actions', async () => {
    const appsWithActions = apps.filter((app) => app.actions?.length > 0);

    const response = await request(app)
      .get('/api/v1/apps?onlyWithActions=true')
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = getAppsMock(appsWithActions);
    expect(response.body).toEqual(expectedPayload);
  });
});
