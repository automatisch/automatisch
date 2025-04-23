import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import App from '../../../../models/app.js';
import app from '../../../../app.js';
import { createApiToken } from '../../../../../test/factories/api-token.js';
import getAppsMock from '../../../../../test/mocks/rest/api/v1/apps/get-apps.js';
import * as license from '../../../../helpers/license.ee.js';

describe('GET /api/v1/apps', () => {
  let apps, token;

  beforeEach(async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    token = (await createApiToken()).token;
    apps = await App.findAll();
  });

  it('should return all apps', async () => {
    const response = await request(app)
      .get('/api/v1/apps')
      .set('x-api-token', token)
      .expect(200);

    const expectedPayload = getAppsMock(apps);
    expect(response.body).toStrictEqual(expectedPayload);
  });

  it('should return all apps filtered by name', async () => {
    const appsWithNameGit = apps.filter((app) => app.name.includes('Git'));

    const response = await request(app)
      .get('/api/v1/apps?name=Git')
      .set('x-api-token', token)
      .expect(200);

    const expectedPayload = getAppsMock(appsWithNameGit);
    expect(response.body).toStrictEqual(expectedPayload);
  });

  it('should return only the apps with triggers', async () => {
    const appsWithTriggers = apps.filter((app) => app.triggers?.length > 0);

    const response = await request(app)
      .get('/api/v1/apps?onlyWithTriggers=true')
      .set('x-api-token', token)
      .expect(200);

    const expectedPayload = getAppsMock(appsWithTriggers);
    expect(response.body).toStrictEqual(expectedPayload);
  });

  it('should return only the apps with actions', async () => {
    const appsWithActions = apps.filter((app) => app.actions?.length > 0);

    const response = await request(app)
      .get('/api/v1/apps?onlyWithActions=true')
      .set('x-api-token', token)
      .expect(200);

    const expectedPayload = getAppsMock(appsWithActions);
    expect(response.body).toStrictEqual(expectedPayload);
  });
});
