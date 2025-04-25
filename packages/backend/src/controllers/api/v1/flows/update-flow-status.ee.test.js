import Crypto from 'crypto';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createApiToken } from '../../../../../test/factories/api-token.js';
import { createFlow } from '../../../../../test/factories/flow.js';
import { createStep } from '../../../../../test/factories/step.js';
import updateFlowStatusMock from '../../../../../test/mocks/rest/api/v1/flows/update-flow-status.js';
import app from '../../../../app.js';
import * as license from '../../../../helpers/license.ee.js';
import Flow from '../../../../models/flow.js';

describe('PATCH /api/v1/flows/:flowId/status', () => {
  let token;

  beforeEach(async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);
    token = (await createApiToken()).token;
  });

  it('should return updated flow data', async () => {
    const flow = await createFlow({
      active: false,
    });

    const triggerStep = await createStep({
      flowId: flow.id,
      type: 'trigger',
      appKey: 'webhook',
      key: 'catchRawWebhook',
    });

    await createStep({
      flowId: flow.id,
      type: 'action',
      appKey: 'ntfy',
      key: 'sendMessage',
      parameters: {
        topic: 'Test notification',
        message: `Message: {{step.${triggerStep.id}.body.message}} by {{step.${triggerStep.id}.body.sender}}`,
      },
    });

    const response = await request(app)
      .patch(`/api/v1/flows/${flow.id}/status`)
      .set('x-api-token', token)
      .send({ active: true })
      .expect(200);

    const refetchedFlow = await Flow.query().findById(response.body.data.id);

    const refetchedFlowSteps = await refetchedFlow
      .$relatedQuery('steps')
      .orderBy('position', 'asc');

    const expectedPayload = await updateFlowStatusMock(
      refetchedFlow,
      refetchedFlowSteps
    );

    expect(response.body).toStrictEqual(expectedPayload);
    expect(response.body.data.status).toStrictEqual('published');
  });

  it('should return not found response for not existing flow UUID', async () => {
    const notExistingFlowUUID = Crypto.randomUUID();

    await request(app)
      .patch(`/api/v1/flows/${notExistingFlowUUID}/status`)
      .set('x-api-token', token)
      .expect(404);
  });

  it('should return bad request response for invalid UUID', async () => {
    await request(app)
      .patch('/api/v1/flows/invalidFlowUUID/status')
      .set('x-api-token', token)
      .expect(400);
  });
});
