import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../../../../app.js';
import createAuthTokenByUserId from '../../../../../helpers/create-auth-token-by-user-id.js';
import { createUser } from '../../../../../../test/factories/user.js';
import { createFlow } from '../../../../../../test/factories/flow.js';
import { createStep } from '../../../../../../test/factories/step.js';
import { createPermission } from '../../../../../../test/factories/permission.js';
import importFlowMock from '../../../../../../test/mocks/rest/internal/api/v1/flows/import-flow.js';

describe('POST /internal/api/v1/flows/import', () => {
  let currentUser, currentUserRole, token;

  beforeEach(async () => {
    currentUser = await createUser();
    currentUserRole = await currentUser.$relatedQuery('role');

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should import the flow data', async () => {
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

    const actionStep = await createStep({
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

    await createPermission({
      action: 'manage',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    const importFlowData = {
      id: currentUserFlow.id,
      name: currentUserFlow.name,
      steps: [
        {
          id: triggerStep.id,
          key: triggerStep.key,
          name: triggerStep.name,
          appKey: triggerStep.appKey,
          type: triggerStep.type,
          parameters: triggerStep.parameters,
          position: triggerStep.position,
          webhookPath: triggerStep.webhookPath,
        },
        {
          id: actionStep.id,
          key: actionStep.key,
          name: actionStep.name,
          appKey: actionStep.appKey,
          type: actionStep.type,
          parameters: actionStep.parameters,
          position: actionStep.position,
        },
      ],
    };

    const response = await request(app)
      .post('/internal/api/v1/flows/import')
      .set('Authorization', token)
      .send(importFlowData)
      .expect(201);

    const expectedPayload = await importFlowMock(currentUserFlow, [
      triggerStep,
      actionStep,
    ]);

    expect(response.body).toMatchObject(expectedPayload);
  });

  it('should have correct parameters of the steps', async () => {
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

    const actionStep = await createStep({
      flowId: currentUserFlow.id,
      type: 'action',
      appKey: 'formatter',
      key: 'text',
      name: 'Text',
      parameters: {
        input: `hello {{step.${triggerStep.id}.query.sample}} {{step.${triggerStep.id}.query.anotherSample}} world`,
        transform: 'capitalize',
      },
      position: 2,
    });

    await createPermission({
      action: 'manage',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    const importFlowData = {
      id: currentUserFlow.id,
      name: currentUserFlow.name,
      steps: [
        {
          id: triggerStep.id,
          key: triggerStep.key,
          name: triggerStep.name,
          appKey: triggerStep.appKey,
          type: triggerStep.type,
          parameters: triggerStep.parameters,
          position: triggerStep.position,
          webhookPath: triggerStep.webhookPath,
        },
        {
          id: actionStep.id,
          key: actionStep.key,
          name: actionStep.name,
          appKey: actionStep.appKey,
          type: actionStep.type,
          parameters: actionStep.parameters,
          position: actionStep.position,
        },
      ],
    };

    const response = await request(app)
      .post('/internal/api/v1/flows/import')
      .set('Authorization', token)
      .send(importFlowData)
      .expect(201);

    const newTriggerParameters = response.body.data.steps[0].parameters;
    const newActionParameters = response.body.data.steps[1].parameters;
    const newTriggerStepId = response.body.data.steps[0].id;

    expect(newTriggerParameters).toMatchObject({
      workSynchronously: true,
    });

    expect(newActionParameters).toMatchObject({
      input: `hello {{step.${newTriggerStepId}.query.sample}} {{step.${newTriggerStepId}.query.anotherSample}} world`,
      transform: 'capitalize',
    });
  });

  it('should have the new flow id in the new webhook url', async () => {
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

    const actionStep = await createStep({
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

    await createPermission({
      action: 'manage',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    const importFlowData = {
      id: currentUserFlow.id,
      name: currentUserFlow.name,
      steps: [
        {
          id: triggerStep.id,
          key: triggerStep.key,
          name: triggerStep.name,
          appKey: triggerStep.appKey,
          type: triggerStep.type,
          parameters: triggerStep.parameters,
          position: triggerStep.position,
          webhookPath: triggerStep.webhookPath,
        },
        {
          id: actionStep.id,
          key: actionStep.key,
          name: actionStep.name,
          appKey: actionStep.appKey,
          type: actionStep.type,
          parameters: actionStep.parameters,
          position: actionStep.position,
        },
      ],
    };

    const response = await request(app)
      .post('/internal/api/v1/flows/import')
      .set('Authorization', token)
      .send(importFlowData)
      .expect(201);

    const newWebhookUrl = response.body.data.steps[0].webhookUrl;

    expect(newWebhookUrl).toContain(`/webhooks/flows/${response.body.data.id}`);
  });

  it('should have the first step id in the input parameter of the second step', async () => {
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

    const actionStep = await createStep({
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

    await createPermission({
      action: 'manage',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    const importFlowData = {
      id: currentUserFlow.id,
      name: currentUserFlow.name,
      steps: [
        {
          id: triggerStep.id,
          key: triggerStep.key,
          name: triggerStep.name,
          appKey: triggerStep.appKey,
          type: triggerStep.type,
          parameters: triggerStep.parameters,
          position: triggerStep.position,
          webhookPath: triggerStep.webhookPath,
        },
        {
          id: actionStep.id,
          key: actionStep.key,
          name: actionStep.name,
          appKey: actionStep.appKey,
          type: actionStep.type,
          parameters: actionStep.parameters,
          position: actionStep.position,
        },
      ],
    };

    const response = await request(app)
      .post('/internal/api/v1/flows/import')
      .set('Authorization', token)
      .send(importFlowData)
      .expect(201);

    const newTriggerStepId = response.body.data.steps[0].id;
    const newActionStepInputParameter =
      response.body.data.steps[1].parameters.input;

    expect(newActionStepInputParameter).toContain(
      `{{step.${newTriggerStepId}.query.sample}}`
    );
  });

  it('should throw an error in case there is no trigger step', async () => {
    const currentUserFlow = await createFlow({ userId: currentUser.id });

    await createPermission({
      action: 'manage',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    const importFlowData = {
      id: currentUserFlow.id,
      name: currentUserFlow.name,
      steps: [],
    };

    const response = await request(app)
      .post('/internal/api/v1/flows/import')
      .set('Authorization', token)
      .send(importFlowData)
      .expect(422);

    expect(response.body.errors.steps).toStrictEqual([
      'The first step must be a trigger!',
    ]);
  });
});
