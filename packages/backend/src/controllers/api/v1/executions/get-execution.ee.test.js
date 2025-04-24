import Crypto from 'node:crypto';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createApiToken } from '../../../../../test/factories/api-token.js';
import { createExecution } from '../../../../../test/factories/execution.js';
import { createFlow } from '../../../../../test/factories/flow.js';
import { createStep } from '../../../../../test/factories/step.js';
import getExecutionMock from '../../../../../test/mocks/rest/api/v1/executions/get-execution.js';
import app from '../../../../app.js';
import * as license from '../../../../helpers/license.ee.js';

describe('GET /api/v1/executions/:executionId', () => {
  let token;

  beforeEach(async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    token = (await createApiToken()).token;
  });

  it('should return the execution data', async () => {
    const flow = await createFlow();

    const stepOne = await createStep({
      flowId: flow.id,
      type: 'trigger',
    });

    const stepTwo = await createStep({
      flowId: flow.id,
      type: 'action',
    });

    const execution = await createExecution({
      flowId: flow.id,
    });

    const response = await request(app)
      .get(`/api/v1/executions/${execution.id}`)
      .set('x-api-token', token)
      .expect(200);

    const expectedPayload = await getExecutionMock(execution, flow, [
      stepOne,
      stepTwo,
    ]);

    expect(response.body).toStrictEqual(expectedPayload);
  });

  it('should return not found response for not existing execution UUID', async () => {
    const notExistingExcecutionUUID = Crypto.randomUUID();

    await request(app)
      .get(`/api/v1/executions/${notExistingExcecutionUUID}`)
      .set('x-api-token', token)
      .expect(404);
  });

  it('should return bad request response for invalid UUID', async () => {
    await request(app)
      .get('/api/v1/executions/invalidExecutionUUID')
      .set('x-api-token', token)
      .expect(400);
  });
});
