import Crypto from 'node:crypto';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import app from '../../../../app.js';
import { createApiToken } from '../../../../../test/factories/api-token.js';
import { createTemplate } from '../../../../../test/factories/template.js';
import { createUser } from '../../../../../test/factories/user.js';
import createFlowMock from '../../../../../test/mocks/rest/api/v1/users/create-flow.js';
import * as license from '../../../../helpers/license.ee.js';

describe('POST /api/v1/flows', () => {
  let user, token;

  beforeEach(async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    user = await createUser();
    token = (await createApiToken()).token;
  });

  it('should create an empty flow when no templateId is provided for the given user', async () => {
    const response = await request(app)
      .post('/api/v1/flows')
      .set('x-api-token', token)
      .send({
        userId: user.id,
      })
      .expect(201);

    const refetchedFlow = await user
      .$relatedQuery('flows')
      .findById(response.body.data.id);

    const expectedPayload = await createFlowMock(refetchedFlow);

    expect(response.body).toMatchObject(expectedPayload);
  });

  it('should create a flow from template when templateId is provided for the given user', async () => {
    const template = await createTemplate({
      name: 'Sample template',
    });

    const response = await request(app)
      .post('/api/v1/flows')
      .set('x-api-token', token)
      .send({
        templateId: template.id,
        userId: user.id,
      })
      .expect(201);

    expect(response.body.data.name).toBe(template.flowData.name);
  });

  it('should return an error when an invalid templateId is provided', async () => {
    await request(app)
      .post('/api/v1/flows')
      .send({
        userId: user.id,
        templateId: 'invalid-template-id',
      })
      .set('x-api-token', token)
      .expect(400);
  });

  it('should respond with HTTP 404 for non-existent user', async () => {
    const notExistingUserId = Crypto.randomUUID();

    await request(app)
      .post('/api/v1/flows')
      .set('x-api-token', token)
      .send({ userId: notExistingUserId })
      .expect(404);
  });

  it('should return bad request response for invalid user UUID', async () => {
    await request(app)
      .post('/api/v1/flows')
      .set('x-api-token', token)
      .send({
        userId: 'invalidUserUUID',
      })
      .expect(400);
  });
});
