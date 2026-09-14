import { describe, it, expect, afterEach } from 'vitest';
import nock from 'nock';
import { Model } from 'objection';
import { client as knex } from '@/config/database.js';
import Connection from '@/models/connection.js';
import newMessageReceived from './triggers/new-message-received/index.js';
import { computeWebhookSignature } from './common/verify-webhook-signature.js';
import { createGlobalVariable } from '@/factories/global-variable.js';
import { createConnection } from '@/factories/connection.js';
import { createFlow } from '@/factories/flow.js';
import { createStep } from '@/factories/step.js';
import {
  envelope,
  inboundMessageEvent,
  OTHER_SIGNING_SECRET,
  SENT_API_URL,
  TEST_API_KEY,
  TEST_SIGNING_SECRET,
  webhook,
} from '@/mocks/apps/sent/index.js';

const WEBHOOK_A = 'aaaaaaaa-0000-4000-8000-000000000001';
const WEBHOOK_B = 'bbbbbbbb-0000-4000-8000-000000000002';

const buildFlowContext = async (connection, user) => {
  const flow = await createFlow(user ? { userId: user.id } : {});
  const step = await createStep({
    flowId: flow.id,
    type: 'trigger',
    appKey: 'sent',
    key: 'newMessageReceived',
    connectionId: connection.id,
    parameters: {},
  });

  return createGlobalVariable({ appKey: 'sent', connection, flow, step });
};

const mockCreate = (id, signingSecret) =>
  nock(SENT_API_URL)
    .post('/v3/webhooks')
    .reply(201, envelope(webhook({ id, signing_secret: signingSecret })));

const delivery = (webhookId, signingSecret, flowId) => {
  const rawBody = Buffer.from(JSON.stringify(inboundMessageEvent));
  const timestamp = String(Math.floor(Date.now() / 1000));

  return {
    params: { flowId },
    rawBody,
    body: inboundMessageEvent,
    headers: {
      'x-webhook-id': webhookId,
      'x-webhook-timestamp': timestamp,
      'x-webhook-signature': computeWebhookSignature({
        webhookId,
        timestamp,
        rawBody,
        signingSecret,
      }),
    },
  };
};

describe('Sent multi-flow webhooks on one connection', () => {
  it('keeps one secret per flow and isolates verification and cleanup', async () => {
    const connection = await createConnection({
      key: 'sent',
      formattedData: { apiKey: TEST_API_KEY, screenName: 'Sent' },
    });

    const flowA = await buildFlowContext(connection);
    const flowB = await buildFlowContext(
      await Connection.query().findById(connection.id)
    );

    mockCreate(WEBHOOK_A, TEST_SIGNING_SECRET);
    await newMessageReceived.registerHook(flowA.$);

    mockCreate(WEBHOOK_B, OTHER_SIGNING_SECRET);
    await newMessageReceived.registerHook(flowB.$);

    const fresh = () => Connection.query().findById(connection.id);

    expect((await fresh()).formattedData.webhookSigningSecrets).toEqual({
      [WEBHOOK_A]: {
        signingSecret: TEST_SIGNING_SECRET,
        flowId: flowA.flow.id,
      },
      [WEBHOOK_B]: {
        signingSecret: OTHER_SIGNING_SECRET,
        flowId: flowB.flow.id,
      },
    });

    const verify = async (request) => (await fresh()).verifyWebhook(request);

    expect(
      await verify(delivery(WEBHOOK_A, TEST_SIGNING_SECRET, flowA.flow.id))
    ).toBe(true);
    expect(
      await verify(delivery(WEBHOOK_B, OTHER_SIGNING_SECRET, flowB.flow.id))
    ).toBe(true);
    expect(
      await verify(delivery(WEBHOOK_A, OTHER_SIGNING_SECRET, flowA.flow.id))
    ).toBe(false);
    expect(
      await verify(delivery(WEBHOOK_B, TEST_SIGNING_SECRET, flowB.flow.id))
    ).toBe(false);
    expect(
      await verify(delivery(WEBHOOK_A, TEST_SIGNING_SECRET, flowB.flow.id))
    ).toBe(false);

    nock(SENT_API_URL).delete(`/v3/webhooks/${WEBHOOK_A}`).reply(204);
    await newMessageReceived.unregisterHook(flowA.$);

    expect((await fresh()).formattedData.webhookSigningSecrets).toEqual({
      [WEBHOOK_B]: {
        signingSecret: OTHER_SIGNING_SECRET,
        flowId: flowB.flow.id,
      },
    });
    expect(
      await verify(delivery(WEBHOOK_A, TEST_SIGNING_SECRET, flowA.flow.id))
    ).toBe(false);
    expect(
      await verify(delivery(WEBHOOK_B, OTHER_SIGNING_SECRET, flowB.flow.id))
    ).toBe(true);

    nock(SENT_API_URL).delete(`/v3/webhooks/${WEBHOOK_B}`).reply(204);
    await newMessageReceived.unregisterHook(flowB.$);

    expect((await fresh()).formattedData.webhookSigningSecrets).toEqual({});
    expect((await fresh()).formattedData.apiKey).toBe(TEST_API_KEY);
  });

  describe('concurrent registration', () => {
    // These records are committed outside the per-test transaction so that
    // the two registrations run in separate database transactions.
    const created = {
      flows: [],
      steps: [],
      connections: [],
      users: [],
      roles: [],
    };

    afterEach(async () => {
      Model.knex(knex);

      await knex('steps').whereIn('id', created.steps).delete();
      await knex('flows').whereIn('id', created.flows).delete();
      await knex('connections').whereIn('id', created.connections).delete();
      await knex('usage_data').whereIn('user_id', created.users).delete();
      await knex('users').whereIn('id', created.users).delete();
      await knex('permissions').whereIn('role_id', created.roles).delete();
      await knex('roles').whereIn('id', created.roles).delete();

      Model.knex(global.knex);
    });

    it('does not lose a secret when two flows register at the same time', async () => {
      Model.knex(knex);

      const connection = await createConnection({
        key: 'sent',
        formattedData: { apiKey: TEST_API_KEY, screenName: 'Sent' },
      });
      created.connections.push(connection.id);

      const flowA = await buildFlowContext(connection);
      const flowB = await buildFlowContext(
        await Connection.query().findById(connection.id)
      );

      for (const context of [flowA, flowB]) {
        created.flows.push(context.flow.id);
        created.steps.push(context.step.id);
        created.users.push(context.flow.userId);
      }

      created.roles.push(
        ...(await knex('users').whereIn('id', created.users).pluck('role_id'))
      );

      mockCreate(WEBHOOK_A, TEST_SIGNING_SECRET);
      mockCreate(WEBHOOK_B, OTHER_SIGNING_SECRET);

      await Promise.all([
        newMessageReceived.registerHook(flowA.$),
        newMessageReceived.registerHook(flowB.$),
      ]);

      const persisted = await Connection.query().findById(connection.id);
      const secrets = persisted.formattedData.webhookSigningSecrets;

      expect(Object.keys(secrets).sort()).toEqual([WEBHOOK_A, WEBHOOK_B]);
      expect(secrets[WEBHOOK_A].flowId).toBe(flowA.flow.id);
      expect(secrets[WEBHOOK_B].flowId).toBe(flowB.flow.id);
      expect(persisted.formattedData.apiKey).toBe(TEST_API_KEY);
    });
  });
});
