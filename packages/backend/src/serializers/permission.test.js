import { describe, it, expect, beforeEach } from 'vitest';
import { createPermission } from '@/factories/permission.js';
import permissionSerializer from '@/serializers/permission.js';

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

    expect(permissionSerializer(permission)).toStrictEqual(expectedPayload);
  });
});
