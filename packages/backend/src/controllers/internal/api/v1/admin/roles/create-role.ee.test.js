import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../../../../../app.js';
import Role from '../../../../../../models/role.js';
import createAuthTokenByUserId from '../../../../../../helpers/create-auth-token-by-user-id.js';
import { createRole } from '../../../../../../../test/factories/role.js';
import { createUser } from '../../../../../../../test/factories/user.js';
import createRoleMock from '../../../../../../../test/mocks/rest/internal/api/v1/admin/roles/create-role.ee.js';
import * as license from '../../../../../../helpers/license.ee.js';

describe('POST /internal/api/v1/admin/roles', () => {
  let role, currentUser, token;

  beforeEach(async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    role = await createRole({ name: 'Admin' });
    currentUser = await createUser({ roleId: role.id });

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should return the created role along with permissions', async () => {
    const roleData = {
      name: 'Viewer',
      description: '',
      permissions: [
        {
          action: 'read',
          subject: 'Flow',
          conditions: ['isCreator'],
        },
      ],
    };

    const response = await request(app)
      .post('/internal/api/v1/admin/roles')
      .set('Authorization', token)
      .send(roleData)
      .expect(201);

    const createdRole = await Role.query()
      .withGraphFetched({ permissions: true })
      .findOne({ name: 'Viewer' })
      .throwIfNotFound();

    const expectedPayload = await createRoleMock(
      {
        ...createdRole,
        ...roleData,
        isAdmin: createdRole.isAdmin,
      },
      [
        {
          ...createdRole.permissions[0],
          ...roleData.permissions[0],
        },
      ]
    );

    expect(response.body).toStrictEqual(expectedPayload);
  });

  it('should return unprocessable entity response for invalid role data', async () => {
    const roleData = {
      description: '',
      permissions: [],
    };

    const response = await request(app)
      .post('/internal/api/v1/admin/roles')
      .set('Authorization', token)
      .send(roleData)
      .expect(422);

    expect(response.body).toStrictEqual({
      errors: {
        name: ["must have required property 'name'"],
      },
      meta: {
        type: 'ModelValidation',
      },
    });
  });

  it('should return unprocessable entity response for duplicate role', async () => {
    await createRole({ name: 'Viewer' });

    const roleData = {
      name: 'Viewer',
      permissions: [],
    };

    const response = await request(app)
      .post('/internal/api/v1/admin/roles')
      .set('Authorization', token)
      .send(roleData)
      .expect(422);

    expect(response.body).toStrictEqual({
      errors: {
        name: ["'name' must be unique."],
      },
      meta: {
        type: 'UniqueViolationError',
      },
    });
  });
});
