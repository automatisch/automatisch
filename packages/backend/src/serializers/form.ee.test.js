import { describe, it, expect, beforeEach } from 'vitest';
import formSerializer from './form.ee.js';
import { createForm } from '../../test/factories/form.js';

describe('formSerializer', () => {
  let form;

  beforeEach(async () => {
    form = await createForm();
  });

  it('should return form data', async () => {
    const expectedPayload = {
      id: form.id,
      name: form.name,
      fields: form.fields,
      createdAt: form.createdAt.getTime(),
      updatedAt: form.updatedAt.getTime(),
    };

    expect(formSerializer(form)).toStrictEqual(expectedPayload);
  });
});
