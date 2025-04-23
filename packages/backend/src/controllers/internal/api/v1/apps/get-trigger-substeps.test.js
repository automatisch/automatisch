import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import App from '../../../../../models/app.js';
import app from '../../../../../app.js';
import createAuthTokenByUserId from '../../../../../helpers/create-auth-token-by-user-id.js';
import { createUser } from '../../../../../../test/factories/user.js';
import getTriggerSubstepsMock from '../../../../../../test/mocks/rest/internal/api/v1/apps/get-trigger-substeps.js';

describe('GET /internal/api/v1/apps/:appKey/triggers/:triggerKey/substeps', () => {
  let currentUser, exampleApp, token;

  beforeEach(async () => {
    currentUser = await createUser();
    token = await createAuthTokenByUserId(currentUser.id);
    exampleApp = await App.findOneByKey('github');
  });

  it('should return the trigger substeps info', async () => {
    const triggers = await App.findTriggersByKey('github');
    const exampleTrigger = triggers.find(
      (trigger) => trigger.key === 'newIssues'
    );

    const endpointUrl = `/internal/api/v1/apps/${exampleApp.key}/triggers/${exampleTrigger.key}/substeps`;

    const response = await request(app)
      .get(endpointUrl)
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = getTriggerSubstepsMock(exampleTrigger.substeps);
    expect(response.body).toStrictEqual(expectedPayload);
  });

  it('should return not found response for invalid app key', async () => {
    await request(app)
      .get(
        '/internal/api/v1/apps/invalid-app-key/triggers/invalid-trigger-key/substeps'
      )
      .set('Authorization', token)
      .expect(404);
  });

  it('should return empty array for invalid trigger key', async () => {
    const endpointUrl = `/internal/api/v1/apps/${exampleApp.key}/triggers/invalid-trigger-key/substeps`;

    const response = await request(app)
      .get(endpointUrl)
      .set('Authorization', token)
      .expect(200);

    expect(response.body.data).toStrictEqual([]);
  });
});
