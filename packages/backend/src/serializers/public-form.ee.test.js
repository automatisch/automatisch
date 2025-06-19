import { describe, it, expect, beforeEach } from 'vitest';
import publicFormSerializer from '@/serializers/public-form.ee.js';
import { createForm } from '@/factories/form.js';

describe('publicFormSerializer', () => {
  let form;

  beforeEach(async () => {
    form = await createForm();
  });

  it('should return public form data', async () => {
    const expectedPayload = {
      id: form.id,
      name: form.name,
      fields: form.fields,
      description: form.description,
      responseMessage: form.responseMessage,
      webhookUrl: form.webhookUrl,
    };

    expect(publicFormSerializer(form)).toStrictEqual(expectedPayload);
  });
});
