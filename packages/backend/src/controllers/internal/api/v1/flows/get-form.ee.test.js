import { describe, it, expect } from 'vitest';
import request from 'supertest';
import Crypto from 'crypto';
import app from '../../../../../app.js';
import { createFlow } from '@/factories/flow.js';
import { createStep } from '@/factories/step.js';
import { createForm } from '@/factories/form.js';
import getFormMock from '@/mocks/rest/internal/api/v1/flows/get-form.js';

describe('GET /internal/api/v1/flows/:flowId/form', () => {
  it('should return the form data', async () => {
    const form = await createForm({
      fields: [
        {
          name: 'name',
          type: 'string',
        },
        {
          name: 'email',
          type: 'string',
        },
      ],
      description: 'Example description',
      responseMessage: 'Example response message',
    });

    const flow = await createFlow({
      userId: form.userId,
    });

    const triggerStep = await createStep({
      flowId: flow.id,
      type: 'trigger',
      parameters: {
        formId: form.id,
      },
    });

    const response = await request(app)
      .get(`/internal/api/v1/flows/${flow.id}/form`)
      .expect(200);

    const expectedPayload = await getFormMock(form, triggerStep);

    expect(response.body).toStrictEqual(expectedPayload);
  });

  it('should return not found response for not existing flow UUID', async () => {
    const notExistingFlowUUID = Crypto.randomUUID();

    await request(app)
      .get(`/internal/api/v1/flows/${notExistingFlowUUID}/form`)
      .expect(404);
  });

  it('should return bad request response for invalid UUID', async () => {
    await request(app)
      .get('/internal/api/v1/flows/invalidFlowUUID/form')
      .expect(400);
  });
});
