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
      displayName: form.displayName,
      fields: form.fields,
      description: form.description,
      responseMessage: form.responseMessage,
      submitButtonText: form.submitButtonText,
      webhookUrl: form.webhookUrl,
      asyncRedirectUrl: form.asyncRedirectUrl,
    };

    expect(publicFormSerializer(form)).toStrictEqual(expectedPayload);
  });
});
