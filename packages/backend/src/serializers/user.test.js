import { vi, describe, it, expect, beforeEach } from 'vitest';
import { DateTime } from 'luxon';
import appConfig from '../config/app';
import { createUser } from '../../test/factories/user';
import { createPermission } from '../../test/factories/permission';
import userSerializer from './user';
import roleSerializer from './role';
import permissionSerializer from './permission';

describe('userSerializer', () => {
  let user, role, permissionOne, permissionTwo;

  beforeEach(async () => {
    user = await createUser();
    role = await user.$relatedQuery('role');

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

  it('should return user data', async () => {
    vi.spyOn(appConfig, 'isCloud', 'get').mockReturnValue(false);

    const expectedPayload = {
      createdAt: user.createdAt.getTime(),
      email: user.email,
      fullName: user.fullName,
      id: user.id,
      status: user.status,
      updatedAt: user.updatedAt.getTime(),
    };

    expect(userSerializer(user)).toEqual(expectedPayload);
  });

  it('should return user data with the role', async () => {
    user.role = role;

    const expectedPayload = {
      role: roleSerializer(role),
    };

    expect(userSerializer(user)).toMatchObject(expectedPayload);
  });

  it('should return user data with the permissions', async () => {
    user.permissions = [permissionOne, permissionTwo];

    const expectedPayload = {
      permissions: [
        permissionSerializer(permissionOne),
        permissionSerializer(permissionTwo),
      ],
    };

    expect(userSerializer(user)).toMatchObject(expectedPayload);
  });

  it('should return user data with trial expiry date', async () => {
    vi.spyOn(appConfig, 'isCloud', 'get').mockReturnValue(true);

    await user.$query().patchAndFetch({
      trialExpiryDate: DateTime.now().plus({ days: 30 }).toISODate(),
    });

    const expectedPayload = {
      trialExpiryDate: user.trialExpiryDate,
    };

    expect(userSerializer(user)).toMatchObject(expectedPayload);
  });
});
