import { describe, it, expect } from 'vitest';
import getEventInternalId from './get-event-internal-id.js';
import {
  deliveredMessageEvent,
  inboundMessageEvent,
  templateEvent,
} from '@/mocks/apps/sent/index.js';

describe('getEventInternalId', () => {
  it('keys inbound messages by message id', () => {
    expect(getEventInternalId(inboundMessageEvent)).toBe(
      'message.received:6ba7b810-9dad-11d1-80b4-00c04fd430c8'
    );
  });

  it('keys outbound messages by message id and status', () => {
    expect(getEventInternalId(deliveredMessageEvent)).toBe(
      'message:8ba7b830-9dad-11d1-80b4-00c04fd430c8:DELIVERED'
    );

    const readEvent = {
      ...deliveredMessageEvent,
      event: 'message.read',
      payload: { ...deliveredMessageEvent.payload, message_status: 'READ' },
    };

    expect(getEventInternalId(readEvent)).toBe(
      'message:8ba7b830-9dad-11d1-80b4-00c04fd430c8:READ'
    );
  });

  it('keys template events by template id and status', () => {
    expect(getEventInternalId(templateEvent)).toBe(
      'templates:9ba7b840-9dad-11d1-80b4-00c04fd430c8:APPROVED'
    );
  });

  it('is stable across retries of the same event', () => {
    expect(getEventInternalId({ ...deliveredMessageEvent })).toBe(
      getEventInternalId(JSON.parse(JSON.stringify(deliveredMessageEvent)))
    );
  });

  it('falls back to a deterministic hash for events without stable ids', () => {
    const event = {
      field: 'message',
      event: 'message.queued',
      payload: { b: 1, a: [2, { c: null }] },
    };
    const reordered = {
      payload: { a: [2, { c: null }], b: 1 },
      event: 'message.queued',
      field: 'message',
    };

    expect(getEventInternalId(event)).toMatch(/^sha256:[0-9a-f]{64}$/);
    expect(getEventInternalId(event)).toBe(getEventInternalId(reordered));
    expect(getEventInternalId(event)).not.toBe(
      getEventInternalId({ ...event, payload: { ...event.payload, b: 2 } })
    );
    expect(getEventInternalId(undefined)).toMatch(/^sha256:/);
  });
});
