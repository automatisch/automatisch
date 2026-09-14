import { describe, it, expect } from 'vitest';
import nock from 'nock';
import getMessageActivities from './index.js';
import { createGlobalVariable } from '@/factories/global-variable.js';
import {
  envelope,
  errorEnvelope,
  messageActivities,
  SENT_API_URL,
  TEST_API_KEY,
} from '@/mocks/apps/sent/index.js';

const MESSAGE_ID = messageActivities.message_id;

const build = (stepParameters) =>
  createGlobalVariable({
    appKey: 'sent',
    formattedData: { apiKey: TEST_API_KEY, screenName: 'Sent' },
    stepKey: 'getMessageActivities',
    stepParameters,
  });

describe('Sent get message activities action', () => {
  it('returns the full activity log', async () => {
    const { $ } = await build({ messageId: MESSAGE_ID });

    nock(SENT_API_URL)
      .get(`/v3/messages/${MESSAGE_ID}/activities`)
      .reply(200, envelope(messageActivities));

    await getMessageActivities.run($);

    const { activities } = $.actionOutput.data.raw.data;

    expect(activities).toHaveLength(3);
    expect(activities.map((a) => a.status)).toEqual([
      'DELIVERED',
      'SENT',
      'QUEUED',
    ]);
  });

  it('returns a blocked message history unchanged', async () => {
    const { $ } = await build({ messageId: MESSAGE_ID });
    const blocked = {
      ...messageActivities,
      activities: [
        { ...messageActivities.activities[2], status: 'BLOCKED' },
        messageActivities.activities[2],
      ],
    };

    nock(SENT_API_URL)
      .get(`/v3/messages/${MESSAGE_ID}/activities`)
      .reply(200, envelope(blocked));

    await getMessageActivities.run($);

    expect($.actionOutput.data.raw.data.activities[0].status).toBe('BLOCKED');
  });

  it('rejects a malformed message id', async () => {
    const { $ } = await build({ messageId: '' });

    await expect(getMessageActivities.run($)).rejects.toThrow(
      'Message ID must be a valid UUID.'
    );
  });

  it('surfaces a missing message', async () => {
    const { $ } = await build({ messageId: MESSAGE_ID });

    nock(SENT_API_URL)
      .get(`/v3/messages/${MESSAGE_ID}/activities`)
      .reply(404, errorEnvelope('RESOURCE_003', 'Message not found'));

    const error = await getMessageActivities.run($).catch((e) => e);

    expect(error.details.error.code).toBe('RESOURCE_003');
  });
});
