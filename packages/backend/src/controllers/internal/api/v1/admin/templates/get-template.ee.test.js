import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../../../../../app.js';
import createAuthTokenByUserId from '@/helpers/create-auth-token-by-user-id.js';
import { createRole } from '@/factories/role.js';
import { createUser } from '@/factories/user.js';
import { createTemplate } from '@/factories/template.js';
import getTemplateMock from '@/mocks/rest/internal/api/v1/admin/templates/get-template.ee.js';
import * as license from '@/helpers/license.ee.js';

describe('GET /internal/api/v1/admin/templates/:templateId', () => {
  let currentUser, token, role;

  beforeEach(async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    role = await createRole({ name: 'Admin' });
    currentUser = await createUser({ roleId: role.id });

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should return templates', async () => {
    const template = await createTemplate();

    const response = await request(app)
      .get(`/internal/api/v1/admin/templates/${template.id}`)
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = await getTemplateMock(template);

    expect(response.body).toStrictEqual(expectedPayload);
  });
});
