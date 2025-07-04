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
        displayName: 'Test Display Name',
        description: 'Test Description',
        responseMessage: 'Test Response Message',
        submitButtonText: 'Test Submit Button Text',
        fields: [
          {
            name: 'Email',
            type: 'string',
            key: 'email',
            required: true,
            readonly: false,
            validationFormat: 'email',
          },
          {
            name: 'Website',
            type: 'string',
            key: 'website',
            required: false,
            readonly: false,
            validationFormat: 'url',
          },
          {
            name: 'Phone',
            type: 'string',
            key: 'phone',
            required: false,
            readonly: false,
            validationFormat: 'tel',
          },
          {
            name: 'Age',
            type: 'string',
            key: 'age',
            required: false,
            readonly: false,
            validationFormat: 'number',
          },
          {
            name: 'Username',
            type: 'string',
            key: 'username',
            required: true,
            readonly: false,
            validationFormat: 'alphanumeric',
          },
          {
            name: 'Code',
            type: 'string',
            key: 'code',
            required: false,
            readonly: false,
            validationFormat: 'custom',
            validationPattern: '^[A-Z]{3}-\\d{3}$',
            validationHelperText: 'Please enter a code in the format: ABC-123',
          },
          {
            name: 'Comments',
            type: 'multiline',
            key: 'comments',
            required: false,
            readonly: false,
          },
          {
            name: 'Subscribe',
            type: 'checkbox',
            key: 'subscribe',
            required: false,
            readonly: true,
          },
          {
            name: 'Birth Date',
            type: 'date',
            key: 'birth_date',
            required: true,
            readonly: false,
          },
          {
            name: 'Appointment Time',
            type: 'time',
            key: 'appointment_time',
            required: false,
            readonly: false,
          },
          {
            name: 'Event Date & Time',
            type: 'datetime',
            key: 'event_datetime',
            required: true,
            readonly: false,
          },
        ],
      })
      .expect(201);

    const refetchedForm = await currentUser
      .$relatedQuery('forms')
      .findById(response.body.data.id);

    const expectedPayload = createFormMock(refetchedForm);

    expect(response.body).toStrictEqual(expectedPayload);
  });
});
