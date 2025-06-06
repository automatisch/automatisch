import { describe, it, expect, beforeEach } from 'vitest';
import { createUser } from '@/factories/user.js';
import adminUserSerializer from '@/serializers/admin/user.js';

describe('adminUserSerializer', () => {
  let user;

  beforeEach(async () => {
    user = await createUser();
  });

  it('should return user data with accept invitation url', async () => {
    const serializedUser = adminUserSerializer(user);

    expect(serializedUser.acceptInvitationUrl).toStrictEqual(
      user.acceptInvitationUrl
    );
  });
});
