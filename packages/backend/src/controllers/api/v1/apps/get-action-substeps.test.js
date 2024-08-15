import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import App from '../../../../models/app';
import app from '../../../../app.js';
import createAuthTokenByUserId from '../../../../helpers/create-auth-token-by-user-id';
import { createUser } from '../../../../../test/factories/user';
import getActionSubstepsMock from '../../../../../test/mocks/rest/api/v1/apps/get-action-substeps.js';

describe('GET /api/v1/apps/:appKey/actions/:actionKey/substeps', () => {
  let currentUser, exampleApp, token;

  beforeEach(async () => {
    currentUser = await createUser();
    token = await createAuthTokenByUserId(currentUser.id);
    exampleApp = await App.findOneByKey('github');
  });

  it('should return the app auth info', async () => {
    const actions = await App.findActionsByKey('github');
    const exampleAction = actions.find(
      (action) => action.key === 'createIssue'
    );

    const endpointUrl = `/api/v1/apps/${exampleApp.key}/actions/${exampleAction.key}/substeps`;

    const response = await request(app)
      .get(endpointUrl)
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = getActionSubstepsMock(exampleAction.substeps);
    expect(response.body).toEqual(expectedPayload);
  });

  it('should return not found response for invalid app key', async () => {
    await request(app)
      .get('/api/v1/apps/invalid-app-key/actions/invalid-actions-key/substeps')
      .set('Authorization', token)
      .expect(404);
  });

  it('should return empty array for invalid action key', async () => {
    const endpointUrl = `/api/v1/apps/${exampleApp.key}/actions/invalid-action-key/substeps`;

    const response = await request(app)
      .get(endpointUrl)
      .set('Authorization', token)
      .expect(200);

    expect(response.body.data).toEqual([]);
  });
});
