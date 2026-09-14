import { describe, it, expect } from 'vitest';
import listMessageContentFields from './index.js';

describe('Sent list message content fields', () => {
  it('renders a text field for text messages', async () => {
    const fields = await listMessageContentFields.run({
      step: { parameters: { contentType: 'text' } },
    });

    expect(fields).toHaveLength(1);
    expect(fields[0]).toMatchObject({
      key: 'text',
      type: 'string',
      required: true,
      variables: true,
    });
  });

  it('renders a template dropdown that loads its parameters', async () => {
    const fields = await listMessageContentFields.run({
      step: { parameters: { contentType: 'template' } },
    });

    expect(fields).toHaveLength(1);
    expect(fields[0]).toMatchObject({
      key: 'templateId',
      type: 'dropdown',
      required: true,
    });
    expect(fields[0].source.arguments).toEqual([
      { name: 'key', value: 'listTemplates' },
      {
        name: 'parameters.senderProfileId',
        value: '{parameters.senderProfileId}',
      },
    ]);
    expect(fields[0].additionalFields.arguments).toEqual([
      { name: 'key', value: 'listTemplateParameters' },
      { name: 'parameters.templateId', value: '{parameters.templateId}' },
    ]);
  });
});
