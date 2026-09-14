import { describe, it, expect } from 'vitest';
import nock from 'nock';
import listTemplateParameters from './index.js';
import { createGlobalVariable } from '@/factories/global-variable.js';
import {
  envelope,
  errorEnvelope,
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

describe('Sent list template parameters dynamic fields', () => {
  it('renders one variable-enabled input per template variable', async () => {
    const { $ } = await build({ templateId: template.id });

    nock(SENT_API_URL)
      .get(`/v3/templates/${template.id}`)
      .reply(200, envelope(template));

    const fields = await listTemplateParameters.run($);

    expect(fields.map((field) => field.key)).toEqual([
      'templateParameter_customerName',
      'templateParameter_orderNumber',
    ]);
    expect(fields[0]).toMatchObject({
      label: 'Template variable: customerName',
      type: 'string',
      required: true,
      variables: true,
    });
  });

  it('scopes the template lookup to the sender profile', async () => {
    const { $ } = await build({
      templateId: template.id,
      senderProfileId: '660e8400-e29b-41d4-a716-446655440001',
    });

    nock(SENT_API_URL)
      .get(`/v3/templates/${template.id}`)
      .matchHeader('x-profile-id', '660e8400-e29b-41d4-a716-446655440001')
      .reply(200, envelope({ ...template, variables: [] }));

    expect(await listTemplateParameters.run($)).toEqual([]);
  });

  it('returns no fields without a template', async () => {
    const { $ } = await build({ templateId: '' });

    expect(await listTemplateParameters.run($)).toEqual([]);
  });

  it('surfaces a missing template', async () => {
    const { $ } = await build({ templateId: template.id });

    nock(SENT_API_URL)
      .get(`/v3/templates/${template.id}`)
      .reply(404, errorEnvelope('RESOURCE_002', 'Template not found'));

    await expect(listTemplateParameters.run($)).rejects.toThrow();
  });
});
