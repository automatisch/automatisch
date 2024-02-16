import { describe, it, expect, beforeEach } from 'vitest';
import { createRole } from '../../test/factories/role';
import roleSerializer from './role';

describe('roleSerializer', () => {
  let role;

  beforeEach(async () => {
    role = await createRole();
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
});
