import { describe, it, expect } from 'vitest';
import {
  buildWebhookSubscription,
  eventTypeOptions,
  MESSAGE_EVENT_SUBTYPES,
} from './webhook-events.js';

describe('Sent webhook events', () => {
  it('offers every documented message sub-type, the family and templates', () => {
    const values = eventTypeOptions.map((option) => option.value);

    expect(values).toEqual([
      'message',
      ...MESSAGE_EVENT_SUBTYPES.map((subtype) => `message.${subtype}`),
      'templates',
    ]);
    expect(MESSAGE_EVENT_SUBTYPES).toContain('received');
    expect(MESSAGE_EVENT_SUBTYPES).toContain('blocked');
  });

  it('maps sub-types to event_types families with event_filters suffixes', () => {
    expect(
      buildWebhookSubscription(['message.delivered', 'message.failed'])
    ).toEqual({
      event_types: ['message'],
      event_filters: { message: ['delivered', 'failed'] },
    });
    expect(buildWebhookSubscription(['message.received'])).toEqual({
      event_types: ['message'],
      event_filters: { message: ['received'] },
    });
  });

  it('subscribes to all message events without filters', () => {
    expect(buildWebhookSubscription(['message'])).toEqual({
      event_types: ['message'],
    });
    expect(buildWebhookSubscription(['message.sent', 'message'])).toEqual({
      event_types: ['message'],
    });
  });

  it('combines message and template families', () => {
    expect(buildWebhookSubscription(['templates', 'message.read'])).toEqual({
      event_types: ['message', 'templates'],
      event_filters: { message: ['read'] },
    });
  });

  it('rejects unknown or empty selections', () => {
    expect(() => buildWebhookSubscription(['messages.delivered'])).toThrow(
      'Unsupported Sent event type "messages.delivered".'
    );
    expect(() => buildWebhookSubscription([])).toThrow(
      'Select at least one Sent event type.'
    );
  });
});
