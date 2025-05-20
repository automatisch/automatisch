import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../../../app.js';
import { createApiToken } from '../../../../../test/factories/api-token.js';
import { createTemplate } from '../../../../../test/factories/template.js';
import getTemplatesMock from '../../../../../test/mocks/rest/internal/api/v1/admin/templates/get-templates.ee.js';
import * as license from '../../../../helpers/license.ee.js';

describe('GET /api/v1/templates', () => {
  let token;

  beforeEach(async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    token = (await createApiToken()).token;
  });

  it('should return templates', async () => {
    const templateOne = await createTemplate();
    const templateTwo = await createTemplate();

    const response = await request(app)
      .get('/api/v1/templates')
      .set('x-api-token', token)
      .expect(200);

    const expectedPayload = await getTemplatesMock([templateOne, templateTwo]);

    expect(response.body).toStrictEqual(expectedPayload);
  });
});
