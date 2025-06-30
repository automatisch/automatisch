import { describe, it, expect, beforeEach } from 'vitest';
import formSerializer from '@/serializers/form.ee.js';
import { createForm } from '@/factories/form.js';

describe('formSerializer', () => {
  let form;

  beforeEach(async () => {
    form = await createForm();
  });

  it('should return form data', async () => {
    const expectedPayload = {
      id: form.id,
      name: form.name,
      displayName: form.displayName,
      responseMessage: form.responseMessage,
      submitButtonText: form.submitButtonText,
      description: form.description,
      fields: form.fields,
      createdAt: form.createdAt.getTime(),
      updatedAt: form.updatedAt.getTime(),
    };

    expect(formSerializer(form)).toStrictEqual(expectedPayload);
  });
});
