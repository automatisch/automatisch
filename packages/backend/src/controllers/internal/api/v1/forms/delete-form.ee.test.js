import Crypto from 'node:crypto';
import request from 'supertest';
import { beforeEach, describe, it, vi } from 'vitest';
import { createUser } from '@/factories/user.js';
import { createForm } from '@/factories/form.js';
import { createPermission } from '@/factories/permission.js';
import createAuthTokenByUserId from '@/helpers/create-auth-token-by-user-id.js';
import * as license from '@/helpers/license.ee.js';
import app from '../../../../../app.js';

describe('DELETE /internal/api/v1/forms/:formId', () => {
  let token, user, form;

  beforeEach(async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    user = await createUser();
    form = await createForm({ userId: user.id });

    token = await createAuthTokenByUserId(user.id);

    await createPermission({
      action: 'manage',
      subject: 'Flow',
      roleId: user.roleId,
    });
  });

  it('should remove the form and return no content', async () => {
    await request(app)
      .delete(`/internal/api/v1/forms/${form.id}`)
      .set('Authorization', token)
      .expect(204);
  });

  it('should return not found response for not existing form UUID', async () => {
    const notExistingFormUUID = Crypto.randomUUID();

    await request(app)
      .delete(`/internal/api/v1/forms/${notExistingFormUUID}`)
      .set('Authorization', token)
      .expect(404);
  });

  it('should return bad request response for invalid form UUID', async () => {
    await request(app)
      .delete(`/internal/api/v1/forms/invalidFormUUID`)
      .set('Authorization', token)
      .expect(400);
  });
});
