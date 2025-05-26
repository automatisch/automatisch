import { describe, it, expect, beforeEach } from 'vitest';
import publicFormSerializer from './public-form.ee.js';
import { createForm } from '../../test/factories/form.js';

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
      webhookUrl: form.webhookUrl,
    };

    expect(publicFormSerializer(form)).toStrictEqual(expectedPayload);
  });
});
