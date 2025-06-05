import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../../../../app.js';
import { createUser } from '@/factories/user.js';
import { createForm } from '@/factories/form.js';
import { createPermission } from '@/factories/permission.js';
import * as license from '@/helpers/license.ee.js';
import getFormsMock from '@/mocks/rest/internal/api/v1/forms/get-forms.js';
import createAuthTokenByUserId from '@/helpers/create-auth-token-by-user-id.js';

describe('GET /internal/api/v1/forms', () => {
  let currentUser, token, formOne, formTwo;

  beforeEach(async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    currentUser = await createUser();
    formOne = await createForm({ userId: currentUser.id });
    formTwo = await createForm({ userId: currentUser.id });

    token = await createAuthTokenByUserId(currentUser.id);

    await createPermission({
      action: 'read',
      subject: 'Flow',
      roleId: currentUser.roleId,
      conditions: ['isCreator'],
    });
  });

  it('should return forms data', async () => {
    const response = await request(app)
      .get('/internal/api/v1/forms')
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = getFormsMock([formTwo, formOne]);

    expect(response.body).toStrictEqual(expectedPayload);
  });
});
