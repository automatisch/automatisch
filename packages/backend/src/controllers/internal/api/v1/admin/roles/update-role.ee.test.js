import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../../../../../app.js';
import createAuthTokenByUserId from '../../../../../../helpers/create-auth-token-by-user-id.js';
import { createRole } from '../../../../../../../test/factories/role.js';
import { createPermission } from '../../../../../../../test/factories/permission.js';
import { createUser } from '../../../../../../../test/factories/user.js';
import updateRoleMock from '../../../../../../../test/mocks/rest/internal/api/v1/admin/roles/update-role.ee.js';
import * as license from '../../../../../../helpers/license.ee.js';

describe('PATCH /internal/api/v1/admin/roles/:roleId', () => {
  let adminRole, viewerRole, currentUser, token;

  beforeEach(async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    adminRole = await createRole({ name: 'Admin' });
    viewerRole = await createRole({ name: 'Viewer' });

    await createPermission({
      action: 'read',
      subject: 'Connection',
    });

    await createPermission({
      action: 'read',
      subject: 'Flow',
    });

    currentUser = await createUser({ roleId: adminRole.id });

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should return the updated role along with permissions', async () => {
    const roleData = {
      name: 'Updated role name',
      description: 'A new description',
      permissions: [
        {
          action: 'read',
          subject: 'Execution',
          conditions: ['isCreator'],
        },
      ],
    };

    const response = await request(app)
      .patch(`/internal/api/v1/admin/roles/${viewerRole.id}`)
      .set('Authorization', token)
      .send(roleData)
      .expect(200);

    const refetchedViewerRole = await viewerRole
      .$query()
      .withGraphFetched({ permissions: true });

    const expectedPayload = await updateRoleMock(
      {
        ...refetchedViewerRole,
        ...roleData,
        isAdmin: false,
      },
      [
        {
          ...refetchedViewerRole.permissions[0],
          ...roleData.permissions[0],
        },
      ]
    );

    expect(response.body).toStrictEqual(expectedPayload);
  });

  it('should return the updated role with sanitized permissions', async () => {
    const validPermission = {
      action: 'manage',
      subject: 'Connection',
      conditions: ['isCreator'],
    };

    const invalidPermission = {
      action: 'publish',
      subject: 'Connection',
      conditions: ['isCreator'],
    };

    const roleData = {
      permissions: [validPermission, invalidPermission],
    };

    const response = await request(app)
      .patch(`/internal/api/v1/admin/roles/${viewerRole.id}`)
      .set('Authorization', token)
      .send(roleData)
      .expect(200);

    const refetchedViewerRole = await viewerRole.$query().withGraphFetched({
      permissions: true,
    });

    const expectedPayload = updateRoleMock(refetchedViewerRole, [
      {
        ...refetchedViewerRole.permissions[0],
        ...validPermission,
      },
    ]);

    expect(response.body).toStrictEqual(expectedPayload);
  });

  it('should return not authorized response for updating admin role', async () => {
    const roleData = {
      name: 'Updated role name',
      description: 'A new description',
      permissions: [
        {
          action: 'read',
          subject: 'Execution',
          conditions: ['isCreator'],
        },
      ],
    };

    await request(app)
      .patch(`/internal/api/v1/admin/roles/${adminRole.id}`)
      .set('Authorization', token)
      .send(roleData)
      .expect(403);
  });

  it('should return unprocessable entity response for invalid role data', async () => {
    const roleData = {
      description: 123,
      permissions: [],
    };

    const response = await request(app)
      .patch(`/internal/api/v1/admin/roles/${viewerRole.id}`)
      .set('Authorization', token)
      .send(roleData)
      .expect(422);

    expect(response.body).toStrictEqual({
      errors: {
        description: ['must be string,null'],
      },
      meta: {
        type: 'ModelValidation',
      },
    });
  });

  it('should return unique violation response for duplicate role data', async () => {
    await createRole({ name: 'Editor' });

    const roleData = {
      name: 'Editor',
      permissions: [],
    };

    const response = await request(app)
      .patch(`/internal/api/v1/admin/roles/${viewerRole.id}`)
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
