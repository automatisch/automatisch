import { describe, it, expect, beforeEach } from 'vitest';
import { createPermission } from '../../test/factories/permission';
import permissionSerializer from './permission';

describe('permissionSerializer', () => {
  let permission;

  beforeEach(async () => {
    permission = await createPermission();
  });

  it('should return permission data', async () => {
    const expectedPayload = {
      id: permission.id,
      roleId: permission.roleId,
      action: permission.action,
      subject: permission.subject,
      conditions: permission.conditions,
      createdAt: permission.createdAt.getTime(),
      updatedAt: permission.updatedAt.getTime(),
    };

    expect(permissionSerializer(permission)).toEqual(expectedPayload);
  });
});
