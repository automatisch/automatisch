import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import Crypto from 'crypto';
import app from '../../../../../../app.js';
import createAuthTokenByUserId from '../../../../../../helpers/create-auth-token-by-user-id.js';
import { createRole } from '../../../../../../../test/factories/role.js';
import { createUser } from '../../../../../../../test/factories/user.js';
import { createTemplate } from '../../../../../../../test/factories/template.js';
import Template from '../../../../../../models/template.ee.js';
import * as license from '../../../../../../helpers/license.ee.js';

describe('DELETE /internal/api/v1/admin/templates/:templateId', () => {
  let currentUser, token, role;

  beforeEach(async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    role = await createRole({ name: 'Admin' });
    currentUser = await createUser({ roleId: role.id });

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should delete the template', async () => {
    const template = await createTemplate();

    await request(app)
      .delete(`/internal/api/v1/admin/templates/${template.id}`)
      .set('Authorization', token)
      .expect(204);

    const deletedTemplate = await Template.query().findById(template.id);
    expect(deletedTemplate).toBeUndefined();
  });

  it('should return not found response for not existing template UUID', async () => {
    const notExistingTemplateUUID = Crypto.randomUUID();

    await request(app)
      .delete(`/internal/api/v1/admin/templates/${notExistingTemplateUUID}`)
      .set('Authorization', token)
      .expect(404);
  });

  it('should return bad request response for invalid UUID', async () => {
    await request(app)
      .delete('/internal/api/v1/admin/templates/invalidTemplateUUID')
      .set('Authorization', token)
      .expect(400);
  });
});
