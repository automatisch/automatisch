import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import Crypto from 'crypto';
import app from '../../../../../app.js';
import createAuthTokenByUserId from '@/helpers/create-auth-token-by-user-id.js';
import { createUser } from '@/factories/user.js';
import { createForm } from '@/factories/form.js';
import { createPermission } from '@/factories/permission.js';
import updateFormMock from '@/mocks/rest/internal/api/v1/forms/update-form.js';

describe('PATCH /internal/api/v1/forms/:formId', () => {
  let currentUser, currentUserRole, form, token;

  beforeEach(async () => {
    currentUser = await createUser();
    currentUserRole = await currentUser.$relatedQuery('role');

    form = await createForm({ userId: currentUser.id });

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should return the updated form data', async () => {
    await createPermission({
      action: 'manage',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    const response = await request(app)
      .patch(`/internal/api/v1/forms/${form.id}`)
      .set('Authorization', token)
      .send({
        name: 'Updated form',
        response_message: 'Updated response message',
        description: 'Updated description',
        fields: [{ key: 'updated value', type: 'string' }],
      })
      .expect(200);

    const refetchedForm = await form.$query();

    const expectedPayload = await updateFormMock({
      ...refetchedForm,
      name: 'Updated form',
      responseMessage: 'Updated response message',
      description: 'Updated description',
      fields: [{ key: 'updated value', type: 'string' }],
    });

    expect(response.body).toStrictEqual(expectedPayload);
  });

  it('should return not found response for not existing form UUID', async () => {
    await createPermission({
      action: 'manage',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    const notExistingFormUUID = Crypto.randomUUID();

    await request(app)
      .patch(`/internal/api/v1/forms/${notExistingFormUUID}`)
      .set('Authorization', token)
      .expect(404);
  });

  it('should return bad request response for invalid form UUID', async () => {
    await createPermission({
      action: 'manage',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    await request(app)
      .patch('/internal/api/v1/forms/invalidFormUUID')
      .set('Authorization', token)
      .expect(400);
  });

  it('should return unprocessable entity response for invalid form data', async () => {
    await createPermission({
      action: 'manage',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    const response = await request(app)
      .patch(`/internal/api/v1/forms/${form.id}`)
      .set('Authorization', token)
      .send({
        name: '',
      })
      .expect(422);

    expect(response.body.errors).toStrictEqual({
      name: ['must NOT have fewer than 1 characters'],
    });

    expect(response.body.meta.type).toStrictEqual('ModelValidation');
  });
});
