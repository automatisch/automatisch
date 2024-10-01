import { describe, it, expect, vi } from 'vitest';
import AccessToken from './access-token.js';
import User from './user.js';
import Base from './base.js';
import SamlAuthProvider from './saml-auth-provider.ee.js';
import { createAccessToken } from '../../test/factories/access-token.js';
import { createUser } from '../../test/factories/user.js';
import { createIdentity } from '../../test/factories/identity.js';

describe('AccessToken model', () => {
  it('tableName should return correct name', () => {
    expect(AccessToken.tableName).toBe('access_tokens');
  });

  it('jsonSchema should have correct validations', () => {
    expect(AccessToken.jsonSchema).toMatchSnapshot();
  });

  it('relationMappings should return correct associations', () => {
    const relationMappings = AccessToken.relationMappings();

    const expectedRelations = {
      user: {
        relation: Base.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'access_tokens.user_id',
          to: 'users.id',
        },
      },
    };

    expect(relationMappings).toStrictEqual(expectedRelations);
  });

  it('revoke should set revokedAt and terminate remote SAML session', async () => {
    const accessToken = await createAccessToken();

    const terminateRemoteSamlSessionSpy = vi
      .spyOn(accessToken, 'terminateRemoteSamlSession')
      .mockImplementation(() => {});

    await accessToken.revoke();

    expect(terminateRemoteSamlSessionSpy).toHaveBeenCalledOnce();
    expect(accessToken.revokedAt).not.toBeUndefined();
  });

  describe('terminateRemoteSamlSession', () => {
    it('should terminate remote SAML session when exists', async () => {
      const user = await createUser();
      const accessToken = await createAccessToken({
        userId: user.id,
        samlSessionId: 'random-remote-session-id',
      });
      await createIdentity({ userId: user.id });

      const terminateRemoteSamlSessionSpy = vi
        .spyOn(SamlAuthProvider.prototype, 'terminateRemoteSession')
        .mockImplementation(() => {});

      await accessToken.terminateRemoteSamlSession();

      expect(terminateRemoteSamlSessionSpy).toHaveBeenCalledWith(
        accessToken.samlSessionId
      );
    });

    it(`should return undefined when remote SALM session doesn't exist`, async () => {
      const user = await createUser();
      const accessToken = await createAccessToken({ userId: user.id });
      await createIdentity({ userId: user.id });

      const terminateRemoteSamlSessionSpy = vi
        .spyOn(SamlAuthProvider.prototype, 'terminateRemoteSession')
        .mockImplementation(() => {});

      const expected = await accessToken.terminateRemoteSamlSession();

      expect(terminateRemoteSamlSessionSpy).not.toHaveBeenCalledOnce();
      expect(expected).toBeUndefined();
    });
  });
});
