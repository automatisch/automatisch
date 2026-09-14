import { describe, it, expect, vi } from 'vitest';
import nock from 'nock';
import appConfig from '@/config/app.js';
import Connection from '@/models/connection.js';
import Flow from '@/models/flow.js';
import { registerWebhook, unregisterWebhook } from './webhook-subscription.js';
import { createGlobalVariable } from '@/factories/global-variable.js';
import { createFlow } from '@/factories/flow.js';
import { createStep } from '@/factories/step.js';
import {
  envelope,
  errorEnvelope,
  OTHER_SIGNING_SECRET,
  SENT_API_URL,
  TEST_API_KEY,
  TEST_SIGNING_SECRET,
  webhook,
} from '@/mocks/apps/sent/index.js';

const WEBHOOK_ID = 'd4f5a6b7-c8d9-4e0f-a1b2-c3d4e5f6a7b8';
const SUBSCRIPTION = {
  event_types: ['message'],
  event_filters: { message: ['received'] },
};

const buildTrigger = async ({
  connection,
  formattedData,
  stepParameters,
} = {}) => {
  const flow = await createFlow();
  const step = await createStep({
    flowId: flow.id,
    type: 'trigger',
    appKey: 'sent',
    key: 'newMessageReceived',
    parameters: stepParameters || {},
  });

  const context = await createGlobalVariable({
    appKey: 'sent',
    connection,
    formattedData: formattedData || {
      apiKey: TEST_API_KEY,
      screenName: 'Sent',
    },
    flow,
    step,
  });

  await step.$query().patch({ connectionId: context.connection.id });

  return context;
};

const getSecrets = async (connectionId) =>
  (await Connection.query().findById(connectionId)).formattedData
    .webhookSigningSecrets;

const mockCreate = (reply = [201, envelope(webhook())]) => {
  const captured = {};

  nock(SENT_API_URL)
    .post('/v3/webhooks', (body) => {
      captured.body = body;
      return true;
    })
    .reply(function () {
      captured.headers = this.req.headers;
      return reply;
    });

  return captured;
};

describe('Sent webhook subscription', () => {
  describe('registerWebhook', () => {
    it('creates the Sent webhook and stores the remote id and secret', async () => {
      const { $, flow, connection } = await buildTrigger();
      const captured = mockCreate();

      await registerWebhook($, SUBSCRIPTION);

      expect(captured.body).toEqual({
        display_name: `Automatisch (flow ${flow.id})`,
        endpoint_url: new URL(
          `/webhooks/flows/${flow.id}`,
          appConfig.webhookUrl
        ).toString(),
        event_types: ['message'],
        event_filters: { message: ['received'] },
        retry_count: 3,
        timeout_seconds: 30,
      });
      expect(captured.headers['x-api-key']).toBe(TEST_API_KEY);

      const persistedFlow = await Flow.query().findById(flow.id);

      expect(persistedFlow.remoteWebhookId).toBe(WEBHOOK_ID);
      expect($.flow.remoteWebhookId).toBe(WEBHOOK_ID);

      expect(await getSecrets(connection.id)).toEqual({
        [WEBHOOK_ID]: { signingSecret: TEST_SIGNING_SECRET, flowId: flow.id },
      });
    });

    it('stores the secret encrypted and never exposes it through the serializer', async () => {
      const { $, connection } = await buildTrigger();
      mockCreate();

      await registerWebhook($, SUBSCRIPTION);

      const row = await global
        .knex('connections')
        .where({ id: connection.id })
        .first();

      expect(row.data).not.toContain(TEST_SIGNING_SECRET);
      expect(row.data).not.toContain('whsec_');
      expect(row.data).not.toContain(TEST_API_KEY);

      const { default: connectionSerializer } = await import(
        '@/serializers/connection.js'
      );
      const serialized = connectionSerializer(
        await Connection.query().findById(connection.id)
      );

      expect(JSON.stringify(serialized)).not.toContain('whsec_');
      expect(serialized.formattedData).toEqual({ screenName: 'Sent' });
    });

    it('scopes the webhook to the selected sender profile', async () => {
      const { $ } = await buildTrigger({
        stepParameters: {
          senderProfileId: '660e8400-e29b-41d4-a716-446655440001',
        },
      });
      const captured = mockCreate();

      await registerWebhook($, SUBSCRIPTION);

      expect(captured.headers['x-profile-id']).toBe(
        '660e8400-e29b-41d4-a716-446655440001'
      );
    });

    it('cleans up a stale remote webhook from an interrupted lifecycle', async () => {
      const { $, flow, connection } = await buildTrigger();

      await $.flow.setRemoteWebhookId('stale-webhook-id');
      await $.auth.set({
        webhookSigningSecrets: {
          'stale-webhook-id': {
            signingSecret: OTHER_SIGNING_SECRET,
            flowId: flow.id,
          },
          'other-flow-webhook': {
            signingSecret: OTHER_SIGNING_SECRET,
            flowId: 'x',
          },
        },
      });

      const deleteScope = nock(SENT_API_URL)
        .delete('/v3/webhooks/stale-webhook-id')
        .reply(404, errorEnvelope('RESOURCE_008', 'Webhook not found'));
      mockCreate();

      await registerWebhook($, SUBSCRIPTION);

      expect(deleteScope.isDone()).toBe(true);
      expect(await getSecrets(connection.id)).toEqual({
        'other-flow-webhook': {
          signingSecret: OTHER_SIGNING_SECRET,
          flowId: 'x',
        },
        [WEBHOOK_ID]: { signingSecret: TEST_SIGNING_SECRET, flowId: flow.id },
      });
    });

    it('does not let a failed stale cleanup block publishing', async () => {
      const { $, flow, connection } = await buildTrigger();

      await $.flow.setRemoteWebhookId('stale-webhook-id');

      nock(SENT_API_URL)
        .delete('/v3/webhooks/stale-webhook-id')
        .reply(403, errorEnvelope('AUTH_004', 'Access denied'));
      mockCreate();

      await registerWebhook($, SUBSCRIPTION);

      expect((await Flow.query().findById(flow.id)).remoteWebhookId).toBe(
        WEBHOOK_ID
      );
      expect(Object.keys(await getSecrets(connection.id))).toEqual([
        WEBHOOK_ID,
      ]);
    });

    it('propagates a failed webhook creation without storing anything', async () => {
      const { $, flow, connection } = await buildTrigger();

      mockCreate([500, errorEnvelope('INTERNAL_001', 'Unexpected error')]);

      await expect(registerWebhook($, SUBSCRIPTION)).rejects.toThrow();

      expect((await Flow.query().findById(flow.id)).remoteWebhookId).toBeNull();
      expect(await getSecrets(connection.id)).toBeUndefined();
    });

    it('deletes the remote webhook when Sent returns no usable secret', async () => {
      const { $, flow, connection } = await buildTrigger();

      mockCreate([201, envelope(webhook({ signing_secret: null }))]);

      const deleteScope = nock(SENT_API_URL)
        .delete(`/v3/webhooks/${WEBHOOK_ID}`)
        .reply(204);

      await expect(registerWebhook($, SUBSCRIPTION)).rejects.toThrow(
        'Sent did not return a webhook ID and signing secret'
      );

      expect(deleteScope.isDone()).toBe(true);
      expect((await Flow.query().findById(flow.id)).remoteWebhookId).toBeNull();
      expect(await getSecrets(connection.id)).toBeUndefined();
    });

    it('rolls back the remote webhook when the secret cannot be persisted', async () => {
      const { $, flow } = await buildTrigger();

      mockCreate();

      const deleteScope = nock(SENT_API_URL)
        .delete(`/v3/webhooks/${WEBHOOK_ID}`)
        .reply(204);

      vi.spyOn($.auth, 'set').mockRejectedValueOnce(new Error('database down'));

      await expect(registerWebhook($, SUBSCRIPTION)).rejects.toThrow(
        'database down'
      );

      expect(deleteScope.isDone()).toBe(true);
      expect((await Flow.query().findById(flow.id)).remoteWebhookId).toBeNull();
    });

    it('rolls back the secret and remote webhook when the remote id cannot be saved', async () => {
      const { $, connection } = await buildTrigger();

      mockCreate();

      const deleteScope = nock(SENT_API_URL)
        .delete(`/v3/webhooks/${WEBHOOK_ID}`)
        .reply(204);

      vi.spyOn($.flow, 'setRemoteWebhookId').mockRejectedValueOnce(
        new Error('flow gone')
      );

      await expect(registerWebhook($, SUBSCRIPTION)).rejects.toThrow(
        'flow gone'
      );

      expect(deleteScope.isDone()).toBe(true);
      expect(await getSecrets(connection.id)).toEqual({});
    });
  });

  describe('unregisterWebhook', () => {
    const registered = async () => {
      const context = await buildTrigger();

      mockCreate();
      await registerWebhook(context.$, SUBSCRIPTION);

      return context;
    };

    it('deletes the remote webhook and forgets only its secret', async () => {
      const { $, flow, connection } = await registered();

      await $.auth.set((data) => ({
        webhookSigningSecrets: {
          ...data.webhookSigningSecrets,
          'other-webhook': {
            signingSecret: OTHER_SIGNING_SECRET,
            flowId: 'other',
          },
        },
      }));

      const deleteScope = nock(SENT_API_URL)
        .delete(`/v3/webhooks/${WEBHOOK_ID}`)
        .reply(204);

      await unregisterWebhook($);

      expect(deleteScope.isDone()).toBe(true);
      expect(await getSecrets(connection.id)).toEqual({
        'other-webhook': {
          signingSecret: OTHER_SIGNING_SECRET,
          flowId: 'other',
        },
      });
      expect($.flow.remoteWebhookId).toBe(WEBHOOK_ID);
      expect((await Flow.query().findById(flow.id)).remoteWebhookId).toBe(
        WEBHOOK_ID
      );
    });

    it('is idempotent when the remote webhook is already gone', async () => {
      const { $, connection } = await registered();

      nock(SENT_API_URL)
        .delete(`/v3/webhooks/${WEBHOOK_ID}`)
        .twice()
        .reply(404, errorEnvelope('RESOURCE_008', 'Webhook not found'));

      await unregisterWebhook($);

      expect(await getSecrets(connection.id)).toEqual({});

      await unregisterWebhook($);

      expect(await getSecrets(connection.id)).toEqual({});
    });

    it('keeps the secret when the remote deletion fails', async () => {
      const { $, connection } = await registered();

      nock(SENT_API_URL)
        .delete(`/v3/webhooks/${WEBHOOK_ID}`)
        .replyWithError('connect ECONNRESET');

      await expect(unregisterWebhook($)).rejects.toThrow();

      expect(Object.keys(await getSecrets(connection.id))).toEqual([
        WEBHOOK_ID,
      ]);
    });

    it('does nothing without a remote webhook id', async () => {
      const { $ } = await buildTrigger();
      const scope = nock(SENT_API_URL).delete(/.*/).reply(204);

      await unregisterWebhook($);

      expect(scope.isDone()).toBe(false);
    });
  });
});
