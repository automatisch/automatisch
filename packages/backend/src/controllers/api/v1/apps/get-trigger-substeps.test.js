import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import App from '../../../../models/app';
import app from '../../../../app.js';
import createAuthTokenByUserId from '../../../../helpers/create-auth-token-by-user-id';
import { createUser } from '../../../../../test/factories/user';
import getTriggerSubstepsMock from '../../../../../test/mocks/rest/api/v1/apps/get-trigger-substeps.js';

describe('GET /api/v1/apps/:appKey/triggers/:triggerKey/substeps', () => {
  let currentUser, exampleApp, token;

  beforeEach(async () => {
    currentUser = await createUser();
    token = await createAuthTokenByUserId(currentUser.id);
    exampleApp = await App.findOneByKey('github');
  });

  it('should return the app auth info', async () => {
    const triggers = await App.findTriggersByKey('github');
    const exampleTrigger = triggers.find(
      (trigger) => trigger.key === 'newIssues'
    );

    const endpointUrl = `/api/v1/apps/${exampleApp.key}/triggers/${exampleTrigger.key}/substeps`;

    const response = await request(app)
      .get(endpointUrl)
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = getTriggerSubstepsMock(exampleTrigger.substeps);
    expect(response.body).toEqual(expectedPayload);
  });

  it('should return not found response for invalid app key', async () => {
    await request(app)
      .get('/api/v1/apps/invalid-app-key/triggers/invalid-trigger-key/substeps')
      .set('Authorization', token)
      .expect(404);
  });

  it('should return empty array for invalid trigger key', async () => {
    const endpointUrl = `/api/v1/apps/${exampleApp.key}/triggers/invalid-trigger-key/substeps`;

    const response = await request(app)
      .get(endpointUrl)
      .set('Authorization', token)
      .expect(200);

    expect(response.body.data).toEqual([]);
  });
});
