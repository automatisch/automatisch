import { describe, expect, it } from 'vitest';
import userAbility from './user-ability.js';

describe('userAbility', () => {
  it('should return PureAbility instantiated with user permissions', () => {
    const user = {
      permissions: [
        {
          subject: 'Flow',
          action: 'read',
          conditions: ['isCreator'],
        },
      ],
      role: {
        name: 'User',
      },
    };

    const ability = userAbility(user);

    expect(ability.rules).toStrictEqual(user.permissions);
  });

  it('should return permission-less PureAbility for user with no role', () => {
    const user = {
      permissions: [
        {
          subject: 'Flow',
          action: 'read',
          conditions: ['isCreator'],
        },
      ],
      role: null,
    };
    const ability = userAbility(user);

    expect(ability.rules).toStrictEqual([]);
  });

  it('should return permission-less PureAbility for user with no permissions', () => {
    const user = { permissions: null, role: { name: 'User' } };
    const ability = userAbility(user);

    expect(ability.rules).toStrictEqual([]);
  });
});
