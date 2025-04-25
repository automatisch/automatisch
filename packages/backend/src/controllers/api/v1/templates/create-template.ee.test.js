import Crypto from 'node:crypto';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createApiToken } from '../../../../../test/factories/api-token.js';
import { createFlow } from '../../../../../test/factories/flow.js';
import { createStep } from '../../../../../test/factories/step.js';
import createTemplateMock from '../../../../../test/mocks/rest/api/v1/templates/create-template.ee.js';
import app from '../../../../app.js';
import * as license from '../../../../helpers/license.ee.js';
import Template from '../../../../models/template.ee.js';

describe('POST /api/v1/templates', () => {
  let token;

  beforeEach(async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    token = (await createApiToken()).token;
  });

  it('should return the created template', async () => {
    const flow = await createFlow();

    const triggerStep = await createStep({
      flowId: flow.id,
      type: 'trigger',
      appKey: 'webhook',
      key: 'catchRawWebhook',
      name: 'Catch raw webhook',
      parameters: {
        workSynchronously: true,
      },
      position: 1,
      webhookPath: `/webhooks/flows/${flow.id}/sync`,
    });

    await createStep({
      flowId: flow.id,
      type: 'action',
      appKey: 'formatter',
      key: 'text',
      name: 'Text',
      parameters: {
        input: `hello {{step.${triggerStep.id}.query.sample}} world`,
        transform: 'capitalize',
      },
      position: 2,
    });

    const templatePayload = {
      name: 'Sample Template Name',
      flowId: flow.id,
    };

    const response = await request(app)
      .post('/api/v1/templates')
      .set('x-api-token', token)
      .send(templatePayload)
      .expect(201);

    const refetchedTemplate = await Template.query().findById(
      response.body.data.id
    );

    const expectedPayload = await createTemplateMock(refetchedTemplate);

    expect(response.body).toStrictEqual(expectedPayload);
  });

  it('should return not found response for invalid flow ID', async () => {
    const invalidFlowId = Crypto.randomUUID();

    await request(app)
      .post('/api/v1/templates')
      .set('x-api-token', token)
      .send({
        name: 'Sample Template Name',
        flowId: invalidFlowId,
      })
      .expect(404);
  });

  it('should return unprocessable entity response for invalid name', async () => {
    const flow = await createFlow();

    const triggerStep = await createStep({
      flowId: flow.id,
      type: 'trigger',
      appKey: 'webhook',
      key: 'catchRawWebhook',
      name: 'Catch raw webhook',
      parameters: {
        workSynchronously: true,
      },
      position: 1,
      webhookPath: `/webhooks/flows/${flow.id}/sync`,
    });

    await createStep({
      flowId: flow.id,
      type: 'action',
      appKey: 'formatter',
      key: 'text',
      name: 'Text',
      parameters: {
        input: `hello {{step.${triggerStep.id}.query.sample}} world`,
        transform: 'capitalize',
      },
      position: 2,
    });

    const templatePayload = {
      name: '',
      flowId: flow.id,
    };

    const response = await request(app)
      .post('/api/v1/templates')
      .set('x-api-token', token)
      .send(templatePayload)
      .expect(422);

    expect(response.body).toStrictEqual({
      errors: {
        name: ['must NOT have fewer than 1 characters'],
      },
      meta: { type: 'ModelValidation' },
    });
  });
});
