import { describe, it, expect } from 'vitest';
import nock from 'nock';
import getContact from './index.js';
import { createGlobalVariable } from '@/factories/global-variable.js';
import {
  contact,
  envelope,
  errorEnvelope,
  SENT_API_URL,
  TEST_API_KEY,
} from '@/mocks/apps/sent/index.js';

const build = (stepParameters) =>
  createGlobalVariable({
    appKey: 'sent',
    formattedData: { apiKey: TEST_API_KEY, screenName: 'Sent' },
    stepKey: 'getContact',
    stepParameters,
  });

describe('Sent get contact action', () => {
  it('returns the contact', async () => {
    const { $ } = await build({ contactId: contact.id });

    nock(SENT_API_URL)
      .get(`/v3/contacts/${contact.id}`)
      .reply(200, envelope(contact));

    await getContact.run($);

    expect($.actionOutput.data.raw.data).toEqual(contact);
  });

  it('rejects a missing or malformed contact id', async () => {
    const { $ } = await build({ contactId: undefined });

    await expect(getContact.run($)).rejects.toThrow(
      'Contact ID must be a valid UUID.'
    );
  });

  it('surfaces a missing contact', async () => {
    const { $ } = await build({ contactId: contact.id });

    nock(SENT_API_URL)
      .get(`/v3/contacts/${contact.id}`)
      .reply(404, errorEnvelope('RESOURCE_001', 'Contact not found'));

    const error = await getContact.run($).catch((e) => e);

    expect(error.details.error.code).toBe('RESOURCE_001');
  });
});
