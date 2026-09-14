import { describe, it, expect } from 'vitest';
import nock from 'nock';
import listTemplates from './index.js';
import { createGlobalVariable } from '@/factories/global-variable.js';
import {
  envelope,
  errorEnvelope,
  pagination,
  template,
  SENT_API_URL,
  TEST_API_KEY,
} from '@/mocks/apps/sent/index.js';

const build = (stepParameters = {}) =>
  createGlobalVariable({
    appKey: 'sent',
    formattedData: { apiKey: TEST_API_KEY, screenName: 'Sent' },
    stepParameters,
  });

describe('Sent list templates dynamic data', () => {
  it('lists approved templates with language and channels in the label', async () => {
    const { $ } = await build();

    nock(SENT_API_URL)
      .get('/v3/templates')
      .query({ page: 1, page_size: 100, status: 'APPROVED' })
      .reply(
        200,
        envelope({ templates: [template], pagination: pagination(1, 100, 1) })
      );

    const result = await listTemplates.run($);

    expect(result.data).toEqual([
      { value: template.id, name: 'Order confirmation (en_US, sms/whatsapp)' },
    ]);
  });

  it('scopes templates to the selected sender profile', async () => {
    const { $ } = await build({
      senderProfileId: '660e8400-e29b-41d4-a716-446655440001',
    });

    nock(SENT_API_URL)
      .get('/v3/templates')
      .query(true)
      .matchHeader('x-profile-id', '660e8400-e29b-41d4-a716-446655440001')
      .reply(
        200,
        envelope({ templates: [template], pagination: pagination(1, 100, 1) })
      );

    const result = await listTemplates.run($);

    expect(result.data).toHaveLength(1);
  });

  it('follows multiple pages', async () => {
    const { $ } = await build();

    nock(SENT_API_URL)
      .get('/v3/templates')
      .query({ page: 1, page_size: 100, status: 'APPROVED' })
      .reply(
        200,
        envelope({ templates: [template], pagination: pagination(1, 100, 150) })
      )
      .get('/v3/templates')
      .query({ page: 2, page_size: 100, status: 'APPROVED' })
      .reply(
        200,
        envelope({
          templates: [{ ...template, id: 't2', name: 'Second' }],
          pagination: pagination(2, 100, 150),
        })
      );

    const result = await listTemplates.run($);

    expect(result.data.map((item) => item.value)).toEqual([template.id, 't2']);
  });

  it('returns an empty list when there are no approved templates', async () => {
    const { $ } = await build();

    nock(SENT_API_URL)
      .get('/v3/templates')
      .query(true)
      .reply(
        200,
        envelope({ templates: [], pagination: pagination(1, 100, 0) })
      );

    expect(await listTemplates.run($)).toEqual({ data: [] });
  });

  it('surfaces credential and permission errors', async () => {
    const { $ } = await build();

    nock(SENT_API_URL)
      .get('/v3/templates')
      .query(true)
      .reply(403, errorEnvelope('AUTH_004', 'Access denied'));

    await expect(listTemplates.run($)).rejects.toThrow();
  });
});
