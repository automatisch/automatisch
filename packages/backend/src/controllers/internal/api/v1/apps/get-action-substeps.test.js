import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import App from '../../../../../models/app.js';
import app from '../../../../../app.js';
import createAuthTokenByUserId from '../../../../../helpers/create-auth-token-by-user-id.js';
import { createUser } from '../../../../../../test/factories/user.js';
import getActionSubstepsMock from '../../../../../../test/mocks/rest/internal/api/v1/apps/get-action-substeps.js';

describe('GET /internal/api/v1/apps/:appKey/actions/:actionKey/substeps', () => {
  let currentUser, exampleApp, token;

  beforeEach(async () => {
    currentUser = await createUser();
    token = await createAuthTokenByUserId(currentUser.id);
    exampleApp = await App.findOneByKey('github');
  });

  it('should return the action substeps info', async () => {
    const actions = await App.findActionsByKey('github');
    const exampleAction = actions.find(
      (action) => action.key === 'createIssue'
    );

    const endpointUrl = `/internal/api/v1/apps/${exampleApp.key}/actions/${exampleAction.key}/substeps`;

    const response = await request(app)
      .get(endpointUrl)
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = getActionSubstepsMock(exampleAction.substeps);
    expect(response.body).toStrictEqual(expectedPayload);
  });

  it('should return not found response for invalid app key', async () => {
    await request(app)
      .get(
        '/internal/api/v1/apps/invalid-app-key/actions/invalid-actions-key/substeps'
      )
      .set('Authorization', token)
      .expect(404);
  });

  it('should return empty array for invalid action key', async () => {
    const endpointUrl = `/internal/api/v1/apps/${exampleApp.key}/actions/invalid-action-key/substeps`;

    const response = await request(app)
      .get(endpointUrl)
      .set('Authorization', token)
      .expect(200);

    expect(response.body.data).toStrictEqual([]);
  });
});
