import { describe, it, expect } from 'vitest';
import nock from 'nock';
import sendMessage from './index.js';
import { createGlobalVariable } from '@/factories/global-variable.js';
import { createExecution } from '@/factories/execution.js';
import {
  envelope,
  errorEnvelope,
  sendMessageResponse,
  SENT_API_URL,
  TEST_API_KEY,
} from '@/mocks/apps/sent/index.js';

const TEMPLATE_ID = '7ba7b820-9dad-11d1-80b4-00c04fd430c8';
const PROFILE_ID = '660e8400-e29b-41d4-a716-446655440001';

const defaults = {
  senderProfileId: '',
  to: '+14155550100',
  channel: 'sent',
  contentType: 'text',
  text: 'Hello from Automatisch',
  sandbox: false,
  idempotencyKey: '',
};

const build = async (stepParameters = {}, { withExecution = true } = {}) => {
  const context = await createGlobalVariable({
    appKey: 'sent',
    formattedData: { apiKey: TEST_API_KEY, screenName: 'Sent' },
    stepKey: 'sendMessage',
    stepParameters: { ...defaults, ...stepParameters },
  });

  if (withExecution) {
    const execution = await createExecution({ flowId: context.flow.id });

    context.$.execution.id = execution.id;
  }

  return context;
};

const mockSend = (reply = [202, envelope(sendMessageResponse)]) => {
  const captured = {};

  nock(SENT_API_URL)
    .post('/v3/messages', (body) => {
      captured.body = body;
      return true;
    })
    .reply(function () {
      captured.headers = this.req.headers;
      return reply;
    });

  return captured;
};

describe('Sent send message action', () => {
  it('sends a text message to one recipient with automatic routing', async () => {
    const { $ } = await build();
    const captured = mockSend();

    await sendMessage.run($);

    expect(captured.body).toEqual({
      to: ['+14155550100'],
      channel: ['sent'],
      text: 'Hello from Automatisch',
    });
    expect(captured.headers['x-api-key']).toBe(TEST_API_KEY);
    expect(captured.headers['x-profile-id']).toBeUndefined();
    expect($.actionOutput.data.raw).toEqual(envelope(sendMessageResponse));
    expect($.actionOutput.data.raw.data.status).toBe('QUEUED');
    expect($.actionOutput.data.raw.data.recipients[0].message_id).toBe(
      '8ba7b830-9dad-11d1-80b4-00c04fd430c8'
    );
  });

  it('fans out to multiple recipients', async () => {
    const { $ } = await build({ to: '+14155550100, +442071234567' });
    const captured = mockSend();

    await sendMessage.run($);

    expect(captured.body.to).toEqual(['+14155550100', '+442071234567']);
  });

  it.each([['sms'], ['whatsapp'], ['rcs']])(
    'pins the %s channel',
    async (channel) => {
      const { $ } = await build({ channel });
      const captured = mockSend();

      await sendMessage.run($);

      expect(captured.body.channel).toEqual([channel]);
    }
  );

  it('broadcasts on several channels when listed', async () => {
    const { $ } = await build({ channel: 'whatsapp, sms' });
    const captured = mockSend();

    await sendMessage.run($);

    expect(captured.body.channel).toEqual(['whatsapp', 'sms']);
  });

  it('sends an approved template with its parameters', async () => {
    const { $ } = await build({
      contentType: 'template',
      templateId: TEMPLATE_ID,
      templateParameter_customerName: 'Maria',
      templateParameter_orderNumber: '#4321',
      text: 'stale hidden value',
    });
    const captured = mockSend();

    await sendMessage.run($);

    expect(captured.body).toEqual({
      to: ['+14155550100'],
      channel: ['sent'],
      template: {
        id: TEMPLATE_ID,
        parameters: { customerName: 'Maria', orderNumber: '#4321' },
      },
    });
    expect(captured.body.text).toBeUndefined();
  });

  it('sends a template without parameters when it has no variables', async () => {
    const { $ } = await build({
      contentType: 'template',
      templateId: TEMPLATE_ID,
    });
    const captured = mockSend();

    await sendMessage.run($);

    expect(captured.body.template).toEqual({ id: TEMPLATE_ID });
  });

  it('never sends the stale template when text is selected', async () => {
    const { $ } = await build({ templateId: TEMPLATE_ID });
    const captured = mockSend();

    await sendMessage.run($);

    expect(captured.body.template).toBeUndefined();
    expect(captured.body.text).toBe('Hello from Automatisch');
  });

  it('sets the sandbox flag only when requested', async () => {
    const { $ } = await build({ sandbox: true });
    const captured = mockSend();

    await sendMessage.run($);

    expect(captured.body.sandbox).toBe(true);

    const { $: $live } = await build({ sandbox: false });
    const capturedLive = mockSend();

    await sendMessage.run($live);

    expect(capturedLive.body.sandbox).toBeUndefined();
  });

  it('scopes the send to a sender profile', async () => {
    const { $ } = await build({ senderProfileId: PROFILE_ID });
    const captured = mockSend();

    await sendMessage.run($);

    expect(captured.headers['x-profile-id']).toBe(PROFILE_ID);
  });

  it('forwards an explicit idempotency key verbatim', async () => {
    const { $ } = await build({ idempotencyKey: 'order-4321_attempt-1' });
    const captured = mockSend();

    await sendMessage.run($);

    expect(captured.headers['idempotency-key']).toBe('order-4321_attempt-1');
  });

  it('derives a stable idempotency key from the execution and step', async () => {
    const { $ } = await build();
    const expectedKey = `automatisch-${$.execution.id}-${$.step.id}`;

    const first = mockSend();
    await sendMessage.run($);

    const second = mockSend();
    await sendMessage.run($);

    expect(first.headers['idempotency-key']).toBe(expectedKey);
    expect(second.headers['idempotency-key']).toBe(expectedKey);
    expect(expectedKey).toMatch(/^[a-zA-Z0-9_-]{1,255}$/);
  });

  it('sends no idempotency key without an execution', async () => {
    const { $ } = await build({}, { withExecution: false });
    const captured = mockSend();

    await sendMessage.run($);

    expect(captured.headers['idempotency-key']).toBeUndefined();
  });

  it('rejects an invalid idempotency key before sending', async () => {
    const { $ } = await build({ idempotencyKey: 'has spaces' });
    const scope = nock(SENT_API_URL).post('/v3/messages').reply(202, {});

    await expect(sendMessage.run($)).rejects.toThrow('Idempotency key');
    expect(scope.isDone()).toBe(false);
  });

  it('rejects invalid phone numbers before sending', async () => {
    const { $ } = await build({ to: '4155550100' });
    const scope = nock(SENT_API_URL).post('/v3/messages').reply(202, {});

    await expect(sendMessage.run($)).rejects.toThrow('E.164');
    expect(scope.isDone()).toBe(false);
  });

  it('rejects an unsupported channel before sending', async () => {
    const { $ } = await build({ channel: 'email' });
    const scope = nock(SENT_API_URL).post('/v3/messages').reply(202, {});

    await expect(sendMessage.run($)).rejects.toThrow('Channel must be one of');
    expect(scope.isDone()).toBe(false);
  });

  it('requires text for the text content type', async () => {
    const { $ } = await build({ text: '   ' });
    const scope = nock(SENT_API_URL).post('/v3/messages').reply(202, {});

    await expect(sendMessage.run($)).rejects.toThrow(
      'Message text is required'
    );
    expect(scope.isDone()).toBe(false);
  });

  it('requires a template for the template content type', async () => {
    const { $ } = await build({ contentType: 'template', templateId: '' });
    const scope = nock(SENT_API_URL).post('/v3/messages').reply(202, {});

    await expect(sendMessage.run($)).rejects.toThrow('A template is required');
    expect(scope.isDone()).toBe(false);
  });

  it('rejects an unknown content type', async () => {
    const { $ } = await build({ contentType: 'both' });

    await expect(sendMessage.run($)).rejects.toThrow('Content type must be');
  });

  it('surfaces Sent validation errors', async () => {
    const { $ } = await build();

    mockSend([
      400,
      errorEnvelope('VALIDATION_001', 'Request validation failed', {
        to: ["Each entry in 'to' must be a valid phone number in E.164 format"],
      }),
    ]);

    const error = await sendMessage.run($).catch((e) => e);

    expect(error.response.status).toBe(400);
    expect(error.details.error.code).toBe('VALIDATION_001');
    expect(error.details.error.details.to).toHaveLength(1);
  });

  it('surfaces an invalid sender profile', async () => {
    const { $ } = await build({ senderProfileId: PROFILE_ID });

    mockSend([404, errorEnvelope('RESOURCE_013', 'Profile not found.')]);

    const error = await sendMessage.run($).catch((e) => e);

    expect(error.response.status).toBe(404);
    expect(error.details.error.message).toBe('Profile not found.');
  });

  it('surfaces rate limiting with the Retry-After header', async () => {
    const { $ } = await build();

    nock(SENT_API_URL)
      .post('/v3/messages')
      .reply(429, errorEnvelope('BUSINESS_002', 'Rate limit exceeded'), {
        'Retry-After': '60',
      });

    const error = await sendMessage.run($).catch((e) => e);

    expect(error.response.status).toBe(429);
    expect(error.response.headers['retry-after']).toBe('60');
    expect(error.details.error.code).toBe('BUSINESS_002');
  });

  it('surfaces server errors and network failures', async () => {
    const { $ } = await build();

    nock(SENT_API_URL)
      .post('/v3/messages')
      .reply(500, errorEnvelope('INTERNAL_001', 'Failed to queue message'));

    const serverError = await sendMessage.run($).catch((e) => e);

    expect(serverError.response.status).toBe(500);

    nock(SENT_API_URL).post('/v3/messages').replyWithError('socket hang up');

    const networkError = await sendMessage.run($).catch((e) => e);

    expect(networkError.details).toEqual({ error: 'socket hang up' });
  });
});
