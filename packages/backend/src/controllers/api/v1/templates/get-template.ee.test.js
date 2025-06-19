import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createApiToken } from '@/factories/api-token.js';
import { createTemplate } from '@/factories/template.js';
import getTemplateMock from '@/mocks/rest/api/v1/templates/get-template.ee.js';
import app from '../../../../app.js';
import * as license from '@/helpers/license.ee.js';

describe('GET /api/v1/templates/:templateId', () => {
  let token;

  beforeEach(async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    token = (await createApiToken()).token;
  });

  it('should return templates', async () => {
    const template = await createTemplate();

    const response = await request(app)
      .get(`/api/v1/templates/${template.id}`)
      .set('x-api-token', token)
      .expect(200);

    const expectedPayload = await getTemplateMock(template);

    expect(response.body).toStrictEqual(expectedPayload);
  });
});
