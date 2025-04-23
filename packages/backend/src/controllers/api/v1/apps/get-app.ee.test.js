import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import App from '../../../../models/app.js';
import app from '../../../../app.js';
import { createApiToken } from '../../../../../test/factories/api-token.js';
import getAppMock from '../../../../../test/mocks/rest/internal/api/v1/apps/get-app.js';
import * as license from '../../../../helpers/license.ee.js';

describe('GET /api/v1/apps/:appKey', () => {
  let token;

  beforeEach(async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    token = (await createApiToken()).token;
  });

  it('should return the app info', async () => {
    const exampleApp = await App.findOneByKey('github');

    const response = await request(app)
      .get(`/api/v1/apps/${exampleApp.key}`)
      .set('x-api-token', token)
      .expect(200);

    const expectedPayload = getAppMock(exampleApp);
    expect(response.body).toStrictEqual(expectedPayload);
  });

  it('should return not found response for invalid app key', async () => {
    await request(app)
      .get('/api/v1/apps/invalid-app-key')
      .set('x-api-token', token)
      .expect(404);
  });
});
