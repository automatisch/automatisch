import { describe, it, expect } from 'vitest';
import nock from 'nock';
import listContacts from './index.js';
import { createGlobalVariable } from '@/factories/global-variable.js';
import {
  contact,
  envelope,
  errorEnvelope,
  pagination,
  SENT_API_URL,
  TEST_API_KEY,
} from '@/mocks/apps/sent/index.js';

const build = (stepParameters = {}) =>
  createGlobalVariable({
    appKey: 'sent',
    formattedData: { apiKey: TEST_API_KEY, screenName: 'Sent' },
    stepKey: 'listContacts',
    stepParameters,
  });

const page = (contacts, pageNumber, pageSize, total) =>
  envelope({ contacts, pagination: pagination(pageNumber, pageSize, total) });

describe('Sent list contacts action', () => {
  it('returns the first page with defaults', async () => {
    const { $ } = await build();

    nock(SENT_API_URL)
      .get('/v3/contacts')
      .query({ page: 1, page_size: 20 })
      .reply(200, page([contact], 1, 20, 1));

    await listContacts.run($);

    expect($.actionOutput.data.raw.data.contacts).toEqual([contact]);
    expect($.actionOutput.data.raw.data.pagination.has_more).toBe(false);
  });

  it('requests a later page with a custom page size', async () => {
    const { $ } = await build({ page: '3', pageSize: '100' });

    nock(SENT_API_URL)
      .get('/v3/contacts')
      .query({ page: 3, page_size: 100 })
      .reply(200, page([], 3, 100, 250));

    await listContacts.run($);

    expect($.actionOutput.data.raw.data.pagination.page).toBe(3);
  });

  it('applies search, channel and phone filters', async () => {
    const { $ } = await build({
      search: 'maria',
      channel: 'whatsapp',
      phone: '+14155550100',
      senderProfileId: '660e8400-e29b-41d4-a716-446655440001',
    });

    nock(SENT_API_URL)
      .get('/v3/contacts')
      .query({
        page: 1,
        page_size: 20,
        search: 'maria',
        channel: 'whatsapp',
        phone: '+14155550100',
      })
      .matchHeader('x-profile-id', '660e8400-e29b-41d4-a716-446655440001')
      .reply(200, page([contact], 1, 20, 1));

    await listContacts.run($);

    expect($.actionOutput.data.raw.data.contacts).toHaveLength(1);
  });

  it('returns an empty page when a phone filter matches nothing', async () => {
    const { $ } = await build({ phone: '+14155550199' });

    nock(SENT_API_URL)
      .get('/v3/contacts')
      .query(true)
      .reply(404, errorEnvelope('RESOURCE_001', 'Contact not found'));

    await listContacts.run($);

    expect($.actionOutput.data.raw.data.contacts).toEqual([]);
    expect($.actionOutput.data.raw.data.pagination.total_count).toBe(0);
    expect($.actionOutput.data.raw.meta.request_id).toBe('req_7X9zKp2jDw');
  });

  it('still surfaces a 404 that is not a contact miss', async () => {
    const { $ } = await build({ phone: '+14155550199' });

    nock(SENT_API_URL)
      .get('/v3/contacts')
      .query(true)
      .reply(404, errorEnvelope('RESOURCE_013', 'Profile not found.'));

    const error = await listContacts.run($).catch((e) => e);

    expect(error.details.error.code).toBe('RESOURCE_013');
  });

  it('rejects a page size above the Sent maximum', async () => {
    const { $ } = await build({ pageSize: '101' });

    await expect(listContacts.run($)).rejects.toThrow('between 1 and 100');
  });

  it('rejects an invalid phone filter', async () => {
    const { $ } = await build({ phone: '555-0100' });

    await expect(listContacts.run($)).rejects.toThrow('E.164');
  });

  it('returns an empty list from Sent unchanged', async () => {
    const { $ } = await build();

    nock(SENT_API_URL)
      .get('/v3/contacts')
      .query(true)
      .reply(200, page([], 1, 20, 0));

    await listContacts.run($);

    expect($.actionOutput.data.raw.data.contacts).toEqual([]);
  });
});
