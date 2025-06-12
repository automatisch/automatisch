import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../../../../app.js';
import { createUser } from '@/factories/user.js';
import { createPermission } from '@/factories/permission.js';
import * as license from '@/helpers/license.ee.js';
import createFormMock from '@/mocks/rest/internal/api/v1/forms/create-form.js';
import createAuthTokenByUserId from '@/helpers/create-auth-token-by-user-id.js';

describe('POST /internal/api/v1/forms', () => {
  let currentUser, token;

  beforeEach(async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    currentUser = await createUser();

    token = await createAuthTokenByUserId(currentUser.id);

    await createPermission({
      action: 'manage',
      subject: 'Flow',
      roleId: currentUser.roleId,
    });
  });

  it('should return form data when trigger step is forms', async () => {
    const response = await request(app)
      .post('/internal/api/v1/forms')
      .set('Authorization', token)
      .send({
        name: 'Test Form',
        description: 'Test Description',
        responseMessage: 'Test Response Message',
      })
      .expect(201);

    const refetchedForm = await currentUser
      .$relatedQuery('forms')
      .findById(response.body.data.id);

    const expectedPayload = createFormMock(refetchedForm);

    expect(response.body).toStrictEqual(expectedPayload);
  });
});
