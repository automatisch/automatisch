import { describe, it, expect, vi } from 'vitest';
import Role from './role';
import Base from './base.js';
import Permission from './permission.js';
import User from './user.js';
import { createRole } from '../../test/factories/role.js';
import { createPermission } from '../../test/factories/permission.js';
import { createUser } from '../../test/factories/user.js';
import { createSamlAuthProvider } from '../../test/factories/saml-auth-provider.ee.js';

describe('Role model', () => {
  it('tableName should return correct name', () => {
    expect(Role.tableName).toBe('roles');
  });

  it('jsonSchema should have correct validations', () => {
    expect(Role.jsonSchema).toMatchSnapshot();
  });

  it('relationMappingsshould return correct associations', () => {
    const relationMappings = Role.relationMappings();

    const expectedRelations = {
      users: {
        relation: Base.HasManyRelation,
        modelClass: User,
        join: {
          from: 'roles.id',
          to: 'users.role_id',
        },
      },
      permissions: {
        relation: Base.HasManyRelation,
        modelClass: Permission,
        join: {
          from: 'roles.id',
          to: 'permissions.role_id',
        },
      },
    };

    expect(relationMappings).toStrictEqual(expectedRelations);
  });

  it('virtualAttributes should return correct attributes', () => {
    expect(Role.virtualAttributes).toStrictEqual(['isAdmin']);
  });

  describe('isAdmin', () => {
    it('should return true for admin named role', () => {
      const role = new Role();
      role.name = 'Admin';

      expect(role.isAdmin).toBe(true);
    });

    it('should return false for not admin named roles', () => {
      const role = new Role();
      role.name = 'User';

      expect(role.isAdmin).toBe(false);
    });
  });

  it('findAdmin should return admin role', async () => {
    const createdAdminRole = await createRole({ name: 'Admin' });

    const adminRole = await Role.findAdmin();

    expect(createdAdminRole).toStrictEqual(adminRole);
  });

  describe('preventAlteringAdmin', () => {
    it('preventAlteringAdmin should throw an error when altering admin role', async () => {
      const role = await createRole({ name: 'Admin' });

      await expect(() => role.preventAlteringAdmin()).rejects.toThrowError(
        'The admin role cannot be altered!'
      );
    });

    it('preventAlteringAdmin should not throw an error when altering non-admin roles', async () => {
      const role = await createRole({ name: 'User' });

      expect(await role.preventAlteringAdmin()).toBe(undefined);
    });
  });

  it("deletePermissions should delete role's permissions", async () => {
    const role = await createRole({ name: 'User' });
    await createPermission({ roleId: role.id });

    await role.deletePermissions();

    expect(await role.$relatedQuery('permissions')).toStrictEqual([]);
  });

  describe('createPermissions', () => {
    it('should create permissions', async () => {
      const role = await createRole({ name: 'User' });

      await role.createPermissions([
        { action: 'read', subject: 'Flow', conditions: [] },
      ]);

      expect(await role.$relatedQuery('permissions')).toMatchObject([
        {
          action: 'read',
          subject: 'Flow',
          conditions: [],
        },
      ]);
    });

    it('should call Permission.filter', async () => {
      const role = await createRole({ name: 'User' });

      const permissions = [{ action: 'read', subject: 'Flow', conditions: [] }];

      const permissionFilterSpy = vi
        .spyOn(Permission, 'filter')
        .mockReturnValue(permissions);

      await role.createPermissions(permissions);

      expect(permissionFilterSpy).toHaveBeenCalledWith(permissions);
    });
  });

  it('updatePermissions should delete existing permissions and create new permissions', async () => {
    const permissionsData = [
      { action: 'read', subject: 'Flow', conditions: [] },
    ];

    const deletePermissionsSpy = vi
      .spyOn(Role.prototype, 'deletePermissions')
      .mockResolvedValueOnce();
    const createPermissionsSpy = vi
      .spyOn(Role.prototype, 'createPermissions')
      .mockResolvedValueOnce();

    const role = await createRole({ name: 'User' });

    await role.updatePermissions(permissionsData);

    expect(deletePermissionsSpy.mock.invocationCallOrder[0]).toBeLessThan(
      createPermissionsSpy.mock.invocationCallOrder[0]
    );

    expect(deletePermissionsSpy).toHaveBeenNthCalledWith(1);
    expect(createPermissionsSpy).toHaveBeenNthCalledWith(1, permissionsData);
  });

  describe('updateWithPermissions', () => {
    it('should update role along with given permissions', async () => {
      const role = await createRole({ name: 'User' });
      await createPermission({
        roleId: role.id,
        subject: 'Flow',
        action: 'read',
        conditions: [],
      });

      const newRoleData = {
        name: 'Updated user',
        description: 'Updated description',
        permissions: [
          {
            action: 'manage',
            subject: 'Flow',
            conditions: [],
          },
        ],
      };

      await role.updateWithPermissions(newRoleData);

      const roleWithPermissions = await role
        .$query()
        .leftJoinRelated({ permissions: true })
        .withGraphFetched({ permissions: true });

      expect(roleWithPermissions).toMatchObject(newRoleData);
    });
  });

  describe('deleteWithPermissions', () => {
    it('should delete role along with given permissions', async () => {
      const role = await createRole({ name: 'User' });
      await createPermission({
        roleId: role.id,
        subject: 'Flow',
        action: 'read',
        conditions: [],
      });

      await role.deleteWithPermissions();

      const refetchedRole = await role.$query();
      const rolePermissions = await Permission.query().where({
        roleId: role.id,
      });

      expect(refetchedRole).toBe(undefined);
      expect(rolePermissions).toStrictEqual([]);
    });
  });

  describe('assertNoRoleUserExists', () => {
    it('should reject with an error when the role has users', async () => {
      const role = await createRole({ name: 'User' });
      await createUser({ roleId: role.id });

      await expect(() => role.assertNoRoleUserExists()).rejects.toThrowError(
        `All users must be migrated away from the "User" role.`
      );
    });

    it('should resolve when the role does not have any users', async () => {
      const role = await createRole();

      expect(await role.assertNoRoleUserExists()).toBe(undefined);
    });
  });

  describe('assertNoConfigurationUsage', () => {
    it('should reject with an error when the role is used in configuration', async () => {
      const role = await createRole();
      await createSamlAuthProvider({ defaultRoleId: role.id });

      await expect(() =>
        role.assertNoConfigurationUsage()
      ).rejects.toThrowError(
        'samlAuthProvider: You need to change the default role in the SAML configuration before deleting this role.'
      );
    });

    it('should resolve when the role does not have any users', async () => {
      const role = await createRole();

      expect(await role.assertNoConfigurationUsage()).toBe(undefined);
    });
  });

  it('assertRoleIsNotUsed should call assertNoRoleUserExists and assertNoConfigurationUsage', async () => {
    const role = new Role();

    const assertNoRoleUserExistsSpy = vi
      .spyOn(role, 'assertNoRoleUserExists')
      .mockResolvedValue();

    const assertNoConfigurationUsageSpy = vi
      .spyOn(role, 'assertNoConfigurationUsage')
      .mockResolvedValue();

    await role.assertRoleIsNotUsed();

    expect(assertNoRoleUserExistsSpy).toHaveBeenCalledOnce();
    expect(assertNoConfigurationUsageSpy).toHaveBeenCalledOnce();
  });

  describe('$beforeDelete', () => {
    it('should call preventAlteringAdmin', async () => {
      const role = await createRole({ name: 'User' });

      const preventAlteringAdminSpy = vi
        .spyOn(role, 'preventAlteringAdmin')
        .mockResolvedValue();

      await role.$query().delete();

      expect(preventAlteringAdminSpy).toHaveBeenCalledOnce();
    });

    it('should call assertRoleIsNotUsed', async () => {
      const role = await createRole({ name: 'User' });

      const assertRoleIsNotUsedSpy = vi
        .spyOn(role, 'assertRoleIsNotUsed')
        .mockResolvedValue();

      await role.$query().delete();

      expect(assertRoleIsNotUsedSpy).toHaveBeenCalledOnce();
    });
  });
});
