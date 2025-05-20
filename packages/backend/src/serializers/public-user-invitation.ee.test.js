import { vi, describe, it, expect, beforeEach } from 'vitest';
import appConfig from '../config/app.js';
import { createUser } from '../../test/factories/user.js';
import publicUserInvitationSerializer from './public-user-invitation.ee.js';
import roleSerializer from './role.js';

describe('publicUserInvitation', () => {
  let user, role;

  beforeEach(async () => {
    user = await createUser();
    role = await user.$relatedQuery('role');
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
      acceptInvitationUrl: user.acceptInvitationUrl,
    };

    expect(publicUserInvitationSerializer(user)).toStrictEqual(expectedPayload);
  });

  it('should return user data with the role', async () => {
    user.role = role;

    const expectedPayload = {
      role: roleSerializer(role),
    };

    expect(publicUserInvitationSerializer(user)).toMatchObject(expectedPayload);
  });
});
