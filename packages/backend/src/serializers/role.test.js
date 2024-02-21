import { describe, it, expect, beforeEach } from 'vitest';
import { createRole } from '../../test/factories/role';
import roleSerializer from './role';
import { createPermission } from '../../test/factories/permission';

describe('roleSerializer', () => {
  let role, permissionOne, permissionTwo;

  beforeEach(async () => {
    role = await createRole();

    permissionOne = await createPermission({
      roleId: role.id,
      action: 'read',
      subject: 'User',
    });

    permissionTwo = await createPermission({
      roleId: role.id,
      action: 'read',
      subject: 'Role',
    });
  });

  it('should return role data', async () => {
    const expectedPayload = {
      id: role.id,
      name: role.name,
      key: role.key,
      description: role.description,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
      isAdmin: role.isAdmin,
    };

    expect(roleSerializer(role)).toEqual(expectedPayload);
  });

  it('should return role data with the permissions', async () => {
    role.permissions = [permissionOne, permissionTwo];

    const expectedPayload = {
      permissions: [permissionOne, permissionTwo],
    };

    expect(roleSerializer(role)).toMatchObject(expectedPayload);
  });
});
