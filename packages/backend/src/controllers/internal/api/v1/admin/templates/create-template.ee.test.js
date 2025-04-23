import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import Crypto from 'crypto';
import app from '../../../../../../app.js';
import createAuthTokenByUserId from '../../../../../../helpers/create-auth-token-by-user-id.js';
import Template from '../../../../../../models/template.ee.js';
import { createRole } from '../../../../../../../test/factories/role.js';
import { createUser } from '../../../../../../../test/factories/user.js';
import { createFlow } from '../../../../../../../test/factories/flow.js';
import { createStep } from '../../../../../../../test/factories/step.js';
import createTemplateMock from '../../../../../../../test/mocks/rest/internal/api/v1/admin/templates/create-template.ee.js';
import * as license from '../../../../../../helpers/license.ee.js';

describe('POST /internal/api/v1/admin/templates', () => {
  let currentUser, token, role;

  beforeEach(async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    role = await createRole({ name: 'Admin' });
    currentUser = await createUser({ roleId: role.id });

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should return the created template', async () => {
    const currentUserFlow = await createFlow({ userId: currentUser.id });

    const triggerStep = await createStep({
      flowId: currentUserFlow.id,
      type: 'trigger',
      appKey: 'webhook',
      key: 'catchRawWebhook',
      name: 'Catch raw webhook',
      parameters: {
        workSynchronously: true,
      },
      position: 1,
      webhookPath: `/webhooks/flows/${currentUserFlow.id}/sync`,
    });

    await createStep({
      flowId: currentUserFlow.id,
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
      flowId: currentUserFlow.id,
    };

    const response = await request(app)
      .post('/internal/api/v1/admin/templates')
      .set('Authorization', token)
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
      .post('/internal/api/v1/admin/templates')
      .set('Authorization', token)
      .send({
        name: 'Sample Template Name',
        flowId: invalidFlowId,
      })
      .expect(404);
  });

  it('should return unprocessable entity response for invalid name', async () => {
    const currentUserFlow = await createFlow({ userId: currentUser.id });

    const triggerStep = await createStep({
      flowId: currentUserFlow.id,
      type: 'trigger',
      appKey: 'webhook',
      key: 'catchRawWebhook',
      name: 'Catch raw webhook',
      parameters: {
        workSynchronously: true,
      },
      position: 1,
      webhookPath: `/webhooks/flows/${currentUserFlow.id}/sync`,
    });

    await createStep({
      flowId: currentUserFlow.id,
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
      flowId: currentUserFlow.id,
    };

    const response = await request(app)
      .post('/internal/api/v1/admin/templates')
      .set('Authorization', token)
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
