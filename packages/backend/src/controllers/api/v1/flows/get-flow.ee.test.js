import Crypto from 'node:crypto';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createApiToken } from '../../../../../test/factories/api-token.js';
import { createFlow } from '../../../../../test/factories/flow.js';
import { createStep } from '../../../../../test/factories/step.js';
import getFlowMock from '../../../../../test/mocks/rest/api/v1/flows/get-flow.js';
import app from '../../../../app.js';
import * as license from '../../../../helpers/license.ee.js';

describe('GET /api/v1/flows/:flowId', () => {
  let token;

  beforeEach(async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    token = (await createApiToken()).token;
  });

  it('should return the flow data', async () => {
    const flow = await createFlow();
    const triggerStep = await createStep({ flowId: flow.id });
    const actionStep = await createStep({ flowId: flow.id });

    const response = await request(app)
      .get(`/api/v1/flows/${flow.id}`)
      .set('x-api-token', token)
      .expect(200);

    const expectedPayload = await getFlowMock(flow, [triggerStep, actionStep]);

    expect(response.body).toStrictEqual(expectedPayload);
  });

  it('should return not found response for not existing flow UUID', async () => {
    const notExistingFlowUUID = Crypto.randomUUID();

    await request(app)
      .get(`/api/v1/flows/${notExistingFlowUUID}`)
      .set('x-api-token', token)
      .expect(404);
  });

  it('should return bad request response for invalid UUID', async () => {
    await request(app)
      .get('/api/v1/flows/invalidFlowUUID')
      .set('x-api-token', token)
      .expect(400);
  });
});
