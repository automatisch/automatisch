import Crypto from 'node:crypto';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../../../../../app.js';
import createAuthTokenByUserId from '../../../../../../helpers/create-auth-token-by-user-id.js';
import { createRole } from '../../../../../../../test/factories/role.js';
import { createPermission } from '../../../../../../../test/factories/permission.js';
import { createSamlAuthProvider } from '../../../../../../../test/factories/saml-auth-provider.ee.js';
import { createUser } from '../../../../../../../test/factories/user.js';
import * as license from '../../../../../../helpers/license.ee.js';

describe('DELETE /internal/api/v1/admin/roles/:roleId', () => {
  let adminRole, currentUser, token;

  beforeEach(async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    adminRole = await createRole({ name: 'Admin' });

    currentUser = await createUser({ roleId: adminRole.id });

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should return HTTP 204 for unused role', async () => {
    const role = await createRole();
    const permission = await createPermission({ roleId: role.id });

    await request(app)
      .delete(`/internal/api/v1/admin/roles/${role.id}`)
      .set('Authorization', token)
      .expect(204);

    const refetchedRole = await role.$query();
    const refetchedPermission = await permission.$query();

    expect(refetchedRole).toBeUndefined();
    expect(refetchedPermission).toBeUndefined();
  });

  it('should return HTTP 404 for not existing role UUID', async () => {
    const notExistingRoleUUID = Crypto.randomUUID();

    await request(app)
      .delete(`/internal/api/v1/admin/roles/${notExistingRoleUUID}`)
      .set('Authorization', token)
      .expect(404);
  });

  it('should return not authorized response for deleting admin role', async () => {
    await request(app)
      .delete(`/internal/api/v1/admin/roles/${adminRole.id}`)
      .set('Authorization', token)
      .expect(403);
  });

  it('should return unprocessable entity response for role used by users', async () => {
    const role = await createRole();
    await createUser({ roleId: role.id });

    const response = await request(app)
      .delete(`/internal/api/v1/admin/roles/${role.id}`)
      .set('Authorization', token)
      .expect(422);

    expect(response.body).toStrictEqual({
      errors: {
        role: [`All users must be migrated away from the "${role.name}" role.`],
      },
      meta: {
        type: 'ValidationError',
      },
    });
  });

  it('should return unprocessable entity response for role used by saml auth providers', async () => {
    const samlAuthProvider = await createSamlAuthProvider();

    const response = await request(app)
      .delete(`/internal/api/v1/admin/roles/${samlAuthProvider.defaultRoleId}`)
      .set('Authorization', token)
      .expect(422);

    expect(response.body).toStrictEqual({
      errors: {
        samlAuthProvider: [
          'You need to change the default role in the SAML configuration before deleting this role.',
        ],
      },
      meta: {
        type: 'ValidationError',
      },
    });
  });
});
