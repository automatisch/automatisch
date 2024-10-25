import { describe, it, expect, beforeEach } from 'vitest';
import { createUser } from '../../../test/factories/user';
import adminUserSerializer from './user.js';

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
