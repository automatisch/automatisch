import { describe, it, expect, vi } from 'vitest';
import AES from 'crypto-js/aes.js';
import enc from 'crypto-js/enc-utf8.js';

import AppConfig from './app-config.js';
import OAuthClient from './oauth-client.js';
import Base from './base.js';
import appConfig from '../config/app.js';
import { createOAuthClient } from '../../test/factories/oauth-client.js';

describe('OAuthClient model', () => {
  it('tableName should return correct name', () => {
    expect(OAuthClient.tableName).toBe('oauth_clients');
  });

  it('jsonSchema should have correct validations', () => {
    expect(OAuthClient.jsonSchema).toMatchSnapshot();
  });

  it('relationMappings should return correct associations', () => {
    const relationMappings = OAuthClient.relationMappings();

    const expectedRelations = {
      appConfig: {
        relation: Base.BelongsToOneRelation,
        modelClass: AppConfig,
        join: {
          from: 'oauth_clients.app_key',
          to: 'app_configs.key',
        },
      },
    };

    expect(relationMappings).toStrictEqual(expectedRelations);
  });

  describe('encryptData', () => {
    it('should return undefined if eligibleForEncryption is not true', async () => {
      vi.spyOn(OAuthClient.prototype, 'eligibleForEncryption').mockReturnValue(
        false
      );

      const oauthClient = new OAuthClient();

      expect(oauthClient.encryptData()).toBeUndefined();
    });

    it('should encrypt formattedAuthDefaults and set it to authDefaults', async () => {
      vi.spyOn(OAuthClient.prototype, 'eligibleForEncryption').mockReturnValue(
        true
      );

      const formattedAuthDefaults = {
        key: 'value',
      };

      const oauthClient = new OAuthClient();
      oauthClient.formattedAuthDefaults = formattedAuthDefaults;
      oauthClient.encryptData();

      const expectedDecryptedValue = JSON.parse(
        AES.decrypt(oauthClient.authDefaults, appConfig.encryptionKey).toString(
          enc
        )
      );

      expect(formattedAuthDefaults).toStrictEqual(expectedDecryptedValue);
      expect(oauthClient.authDefaults).not.toStrictEqual(formattedAuthDefaults);
    });

    it('should encrypt formattedAuthDefaults and remove formattedAuthDefaults', async () => {
      vi.spyOn(OAuthClient.prototype, 'eligibleForEncryption').mockReturnValue(
        true
      );

      const formattedAuthDefaults = {
        key: 'value',
      };

      const oauthClient = new OAuthClient();
      oauthClient.formattedAuthDefaults = formattedAuthDefaults;
      oauthClient.encryptData();

      expect(oauthClient.formattedAuthDefaults).not.toBeDefined();
    });
  });

  describe('decryptData', () => {
    it('should return undefined if eligibleForDecryption is not true', () => {
      vi.spyOn(OAuthClient.prototype, 'eligibleForDecryption').mockReturnValue(
        false
      );

      const oauthClient = new OAuthClient();

      expect(oauthClient.decryptData()).toBeUndefined();
    });

    it('should decrypt authDefaults and set it to formattedAuthDefaults', async () => {
      vi.spyOn(OAuthClient.prototype, 'eligibleForDecryption').mockReturnValue(
        true
      );

      const formattedAuthDefaults = {
        key: 'value',
      };

      const authDefaults = AES.encrypt(
        JSON.stringify(formattedAuthDefaults),
        appConfig.encryptionKey
      ).toString();

      const oauthClient = new OAuthClient();
      oauthClient.authDefaults = authDefaults;
      oauthClient.decryptData();

      expect(oauthClient.formattedAuthDefaults).toStrictEqual(
        formattedAuthDefaults
      );
      expect(oauthClient.authDefaults).not.toStrictEqual(formattedAuthDefaults);
    });
  });

  describe('eligibleForEncryption', () => {
    it('should return true when formattedAuthDefaults property exists', async () => {
      const oauthClient = await createOAuthClient();

      expect(oauthClient.eligibleForEncryption()).toBe(true);
    });

    it("should return false when formattedAuthDefaults property doesn't exist", async () => {
      const oauthClient = await createOAuthClient();

      delete oauthClient.formattedAuthDefaults;

      expect(oauthClient.eligibleForEncryption()).toBe(false);
    });
  });

  describe('eligibleForDecryption', () => {
    it('should return true when authDefaults property exists', async () => {
      const oauthClient = await createOAuthClient();

      expect(oauthClient.eligibleForDecryption()).toBe(true);
    });

    it("should return false when authDefaults property doesn't exist", async () => {
      const oauthClient = await createOAuthClient();

      delete oauthClient.authDefaults;

      expect(oauthClient.eligibleForDecryption()).toBe(false);
    });
  });

  it('$beforeInsert should call OAuthClient.encryptData', async () => {
    const oauthClientBeforeInsertSpy = vi.spyOn(
      OAuthClient.prototype,
      'encryptData'
    );

    await createOAuthClient();

    expect(oauthClientBeforeInsertSpy).toHaveBeenCalledOnce();
  });

  it('$beforeUpdate should call OAuthClient.encryptData', async () => {
    const oauthClient = await createOAuthClient();

    const oauthClientBeforeUpdateSpy = vi.spyOn(
      OAuthClient.prototype,
      'encryptData'
    );

    await oauthClient.$query().patchAndFetch({ name: 'sample' });

    expect(oauthClientBeforeUpdateSpy).toHaveBeenCalledOnce();
  });

  it('$afterFind should call OAuthClient.decryptData', async () => {
    const oauthClient = await createOAuthClient();

    const oauthClientAfterFindSpy = vi.spyOn(
      OAuthClient.prototype,
      'decryptData'
    );

    await oauthClient.$query();

    expect(oauthClientAfterFindSpy).toHaveBeenCalledOnce();
  });
});
