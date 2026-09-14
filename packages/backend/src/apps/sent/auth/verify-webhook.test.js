import { describe, it, expect } from 'vitest';
import Connection from '@/models/connection.js';
import { createConnection } from '@/factories/connection.js';
import { computeWebhookSignature } from '../common/verify-webhook-signature.js';
import {
  inboundMessageEvent,
  OTHER_SIGNING_SECRET,
  TEST_API_KEY,
  TEST_SIGNING_SECRET,
} from '@/mocks/apps/sent/index.js';

const WEBHOOK_A = 'aaaaaaaa-0000-4000-8000-000000000001';
const WEBHOOK_B = 'bbbbbbbb-0000-4000-8000-000000000002';
const FLOW_A = 'flow-a';
const FLOW_B = 'flow-b';

const rawBody = Buffer.from(JSON.stringify(inboundMessageEvent));

const buildConnection = () =>
  createConnection({
    key: 'sent',
    formattedData: {
      apiKey: TEST_API_KEY,
      screenName: 'Sent',
      webhookSigningSecrets: {
        [WEBHOOK_A]: { signingSecret: TEST_SIGNING_SECRET, flowId: FLOW_A },
        [WEBHOOK_B]: { signingSecret: OTHER_SIGNING_SECRET, flowId: FLOW_B },
      },
    },
  });

const buildRequest = ({
  webhookId = WEBHOOK_A,
  flowId = FLOW_A,
  signingSecret = TEST_SIGNING_SECRET,
  timestamp = String(Math.floor(Date.now() / 1000)),
  body = rawBody,
  headers = {},
} = {}) => ({
  params: { flowId },
  rawBody: body,
  body: JSON.parse(body.toString('utf8')),
  headers: {
    'content-type': 'application/json',
    'x-webhook-id': webhookId,
    'x-webhook-timestamp': timestamp,
    'x-webhook-signature': computeWebhookSignature({
      webhookId,
      timestamp,
      rawBody: body,
      signingSecret,
    }),
    'x-webhook-event-type': 'message.received',
    ...headers,
  },
});

describe('Sent verifyWebhook through Connection.verifyWebhook', () => {
  it('accepts a valid delivery for the flow that registered the webhook', async () => {
    const connection = await buildConnection();

    expect(await connection.verifyWebhook(buildRequest())).toBe(true);
  });

  it('accepts each flow with its own secret', async () => {
    const connection = await buildConnection();

    expect(
      await connection.verifyWebhook(
        buildRequest({
          webhookId: WEBHOOK_B,
          flowId: FLOW_B,
          signingSecret: OTHER_SIGNING_SECRET,
        })
      )
    ).toBe(true);
  });

  it("rejects a delivery signed with another flow's secret", async () => {
    const connection = await buildConnection();

    expect(
      await connection.verifyWebhook(
        buildRequest({ signingSecret: OTHER_SIGNING_SECRET })
      )
    ).toBe(false);
    expect(
      await connection.verifyWebhook(
        buildRequest({
          webhookId: WEBHOOK_B,
          flowId: FLOW_B,
          signingSecret: TEST_SIGNING_SECRET,
        })
      )
    ).toBe(false);
  });

  it('rejects a valid delivery replayed to another flow of the same connection', async () => {
    const connection = await buildConnection();

    expect(
      await connection.verifyWebhook(buildRequest({ flowId: FLOW_B }))
    ).toBe(false);
  });

  it('rejects unknown webhook ids', async () => {
    const connection = await buildConnection();

    expect(
      await connection.verifyWebhook(
        buildRequest({ webhookId: 'cccccccc-0000-4000-8000-000000000003' })
      )
    ).toBe(false);
  });

  it('rejects tampered bodies, including whitespace changes', async () => {
    const connection = await buildConnection();
    const request = buildRequest();

    request.rawBody = Buffer.from(
      request.rawBody.toString('utf8').replace('question', 'complaint')
    );
    expect(await connection.verifyWebhook(request)).toBe(false);

    const reformatted = buildRequest();
    reformatted.rawBody = Buffer.from(
      JSON.stringify(reformatted.body, null, 2)
    );
    expect(await connection.verifyWebhook(reformatted)).toBe(false);
  });

  it('verifies the exact raw bytes rather than re-serialized JSON', async () => {
    const connection = await buildConnection();
    const body = Buffer.from(
      '{ "field": "message",\n "event": "message.received", "payload": {"text": "ünïcode ✓"} }'
    );

    expect(await connection.verifyWebhook(buildRequest({ body }))).toBe(true);

    const reserialized = buildRequest({ body });
    reserialized.rawBody = Buffer.from(JSON.stringify(reserialized.body));

    expect(await connection.verifyWebhook(reserialized)).toBe(false);
  });

  it('rejects missing, malformed and mismatched signatures', async () => {
    const connection = await buildConnection();

    for (const signature of [
      undefined,
      '',
      'v1,',
      'sha256=abc',
      'v1,QUJD',
      ['v1,a', 'v1,b'],
    ]) {
      const request = buildRequest();
      request.headers['x-webhook-signature'] = signature;

      expect(await connection.verifyWebhook(request)).toBe(false);
    }
  });

  it('rejects stale, future, missing and malformed timestamps', async () => {
    const connection = await buildConnection();
    const now = Math.floor(Date.now() / 1000);

    expect(
      await connection.verifyWebhook(
        buildRequest({ timestamp: String(now - 301) })
      )
    ).toBe(false);
    expect(
      await connection.verifyWebhook(
        buildRequest({ timestamp: String(now + 301) })
      )
    ).toBe(false);
    expect(
      await connection.verifyWebhook(
        buildRequest({ timestamp: String(now - 60) })
      )
    ).toBe(true);

    const missing = buildRequest();
    delete missing.headers['x-webhook-timestamp'];
    expect(await connection.verifyWebhook(missing)).toBe(false);

    const malformed = buildRequest();
    malformed.headers['x-webhook-timestamp'] = 'yesterday';
    expect(await connection.verifyWebhook(malformed)).toBe(false);
  });

  it('rejects requests without a raw body or webhook id', async () => {
    const connection = await buildConnection();

    const noBody = buildRequest();
    delete noBody.rawBody;
    expect(await connection.verifyWebhook(noBody)).toBe(false);

    const noId = buildRequest();
    delete noId.headers['x-webhook-id'];
    expect(await connection.verifyWebhook(noId)).toBe(false);
  });

  it('rejects everything for a connection without registered webhooks', async () => {
    const connection = await createConnection({
      key: 'sent',
      formattedData: { apiKey: TEST_API_KEY, screenName: 'Sent' },
    });

    expect(await connection.verifyWebhook(buildRequest())).toBe(false);
  });

  it('is wired as the app auth hook', async () => {
    const connection = await buildConnection();
    const app = await connection.getApp();

    expect(app.auth.verifyWebhook).toBeTypeOf('function');
    expect(Connection.prototype.verifyWebhook).toBeTypeOf('function');
  });
});
