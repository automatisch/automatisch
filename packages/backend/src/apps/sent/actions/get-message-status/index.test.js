import { describe, it, expect } from 'vitest';
import nock from 'nock';
import getMessageStatus from './index.js';
import { createGlobalVariable } from '@/factories/global-variable.js';
import {
  envelope,
  errorEnvelope,
  message,
  SENT_API_URL,
  TEST_API_KEY,
} from '@/mocks/apps/sent/index.js';

const build = (stepParameters) =>
  createGlobalVariable({
    appKey: 'sent',
    formattedData: { apiKey: TEST_API_KEY, screenName: 'Sent' },
    stepKey: 'getMessageStatus',
    stepParameters,
  });

describe('Sent get message status action', () => {
  it('returns the message with its lifecycle events', async () => {
    const { $ } = await build({ messageId: message.id });

    nock(SENT_API_URL)
      .get(`/v3/messages/${message.id}`)
      .reply(200, envelope(message));

    await getMessageStatus.run($);

    expect($.actionOutput.data.raw.data.status).toBe('DELIVERED');
    expect($.actionOutput.data.raw.data.events.map((e) => e.status)).toEqual([
      'DELIVERED',
      'SENT',
      'QUEUED',
    ]);
  });

  it('returns non-terminal statuses unchanged', async () => {
    const { $ } = await build({ messageId: message.id });

    nock(SENT_API_URL)
      .get(`/v3/messages/${message.id}`)
      .reply(200, envelope({ ...message, status: 'ROUTED' }));

    await getMessageStatus.run($);

    expect($.actionOutput.data.raw.data.status).toBe('ROUTED');
  });

  it('passes the sender profile header', async () => {
    const { $ } = await build({
      messageId: message.id,
      senderProfileId: '660e8400-e29b-41d4-a716-446655440001',
    });

    nock(SENT_API_URL)
      .get(`/v3/messages/${message.id}`)
      .matchHeader('x-profile-id', '660e8400-e29b-41d4-a716-446655440001')
      .reply(200, envelope(message));

    await getMessageStatus.run($);

    expect($.actionOutput.data.raw.data.id).toBe(message.id);
  });

  it('rejects a malformed message id without calling Sent', async () => {
    const { $ } = await build({ messageId: 'not-a-uuid' });
    const scope = nock(SENT_API_URL).get(/.*/).reply(200, {});

    await expect(getMessageStatus.run($)).rejects.toThrow(
      'Message ID must be a valid UUID.'
    );
    expect(scope.isDone()).toBe(false);
  });

  it('surfaces a missing message', async () => {
    const { $ } = await build({ messageId: message.id });

    nock(SENT_API_URL)
      .get(`/v3/messages/${message.id}`)
      .reply(404, errorEnvelope('RESOURCE_003', 'Message not found'));

    const error = await getMessageStatus.run($).catch((e) => e);

    expect(error.response.status).toBe(404);
    expect(error.details.error.code).toBe('RESOURCE_003');
  });
});
