import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import Crypto from 'crypto';
import app from '../../../../../app.js';
import { createUser } from '@/factories/user.js';
import { createForm } from '@/factories/form.js';
import * as license from '@/helpers/license.ee.js';
import getFormMock from '@/mocks/rest/internal/api/v1/forms/get-form.ee.js';

describe('GET /internal/api/v1/forms/:formId', () => {
  let currentUser, form;

  beforeEach(async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    currentUser = await createUser();
    form = await createForm({ userId: currentUser.id });
  });

  it('should return form data when trigger step is forms', async () => {
    const response = await request(app)
      .get(`/internal/api/v1/forms/${form.id}`)
      .expect(200);

    const expectedPayload = getFormMock(form);

    expect(response.body).toStrictEqual(expectedPayload);
  });

  it('should return 404 for non-existent form', async () => {
    const nonExistentFormId = Crypto.randomUUID();

    await request(app)
      .get(`/internal/api/v1/forms/${nonExistentFormId}`)
      .expect(404);
  });
});
