import Crypto from 'node:crypto';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createApiToken } from '../../../../../test/factories/api-token.js';
import { createTemplate } from '../../../../../test/factories/template.js';
import app from '../../../../app.js';
import * as license from '../../../../helpers/license.ee.js';
import Template from '../../../../models/template.ee.js';

describe('DELETE /api/v1/templates/:templateId', () => {
  let token;

  beforeEach(async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    token = (await createApiToken()).token;
  });

  it('should delete the template', async () => {
    const template = await createTemplate();

    await request(app)
      .delete(`/api/v1/templates/${template.id}`)
      .set('x-api-token', token)
      .expect(204);

    const deletedTemplate = await Template.query().findById(template.id);

    expect(deletedTemplate).toBeUndefined();
  });

  it('should return not found response for not existing template UUID', async () => {
    const notExistingTemplateUUID = Crypto.randomUUID();

    await request(app)
      .delete(`/api/v1/templates/${notExistingTemplateUUID}`)
      .set('x-api-token', token)
      .expect(404);
  });

  it('should return bad request response for invalid UUID', async () => {
    await request(app)
      .delete('/api/v1/templates/invalidTemplateUUID')
      .set('x-api-token', token)
      .expect(400);
  });
});
