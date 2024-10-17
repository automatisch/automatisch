import { describe, it, expect, vi } from 'vitest';
import AES from 'crypto-js/aes.js';
import enc from 'crypto-js/enc-utf8.js';
import appConfig from '../config/app.js';
import AppAuthClient from './app-auth-client.js';
import App from './app.js';
import AppConfig from './app-config.js';
import Base from './base.js';
import Connection from './connection';
import Step from './step.js';
import User from './user.js';
import { createConnection } from '../../test/factories/connection.js';
import { createAppConfig } from '../../test/factories/app-config.js';

describe('Connection model', () => {
  it('tableName should return correct name', () => {
    expect(Connection.tableName).toBe('connections');
  });

  it('jsonSchema should have correct validations', () => {
    expect(Connection.jsonSchema).toMatchSnapshot();
  });

  it('virtualAttributes should return correct attributes', () => {
    const virtualAttributes = Connection.virtualAttributes;

    const expectedAttributes = ['reconnectable'];

    expect(virtualAttributes).toStrictEqual(expectedAttributes);
  });

  describe('relationMappings', () => {
    it('should return correct associations', () => {
      const relationMappings = Connection.relationMappings();

      const expectedRelations = {
        user: {
          relation: Base.BelongsToOneRelation,
          modelClass: User,
          join: {
            from: 'connections.user_id',
            to: 'users.id',
          },
        },
        steps: {
          relation: Base.HasManyRelation,
          modelClass: Step,
          join: {
            from: 'connections.id',
            to: 'steps.connection_id',
          },
        },
        triggerSteps: {
          relation: Base.HasManyRelation,
          modelClass: Step,
          join: {
            from: 'connections.id',
            to: 'steps.connection_id',
          },
          filter: expect.any(Function),
        },
        appConfig: {
          relation: Base.BelongsToOneRelation,
          modelClass: AppConfig,
          join: {
            from: 'connections.key',
            to: 'app_configs.key',
          },
        },
        appAuthClient: {
          relation: Base.BelongsToOneRelation,
          modelClass: AppAuthClient,
          join: {
            from: 'connections.app_auth_client_id',
            to: 'app_auth_clients.id',
          },
        },
      };

      expect(relationMappings).toStrictEqual(expectedRelations);
    });

    it('triggerSteps should return only trigger typed steps', () => {
      const relations = Connection.relationMappings();
      const whereSpy = vi.fn();

      relations.triggerSteps.filter({ where: whereSpy });

      expect(whereSpy).toHaveBeenCalledWith('type', '=', 'trigger');
    });
  });

  describe.todo('reconnectable');

  describe('encryptData', () => {
    it('should return undefined if eligibleForEncryption is not true', async () => {
      vi.spyOn(Connection.prototype, 'eligibleForEncryption').mockReturnValue(
        false
      );

      const connection = new Connection();

      expect(connection.encryptData()).toBeUndefined();
    });

    it('should encrypt formattedData and set it to data', async () => {
      vi.spyOn(Connection.prototype, 'eligibleForEncryption').mockReturnValue(
        true
      );

      const formattedData = {
        key: 'value',
      };

      const connection = new Connection();
      connection.formattedData = formattedData;
      connection.encryptData();

      const expectedDecryptedValue = JSON.parse(
        AES.decrypt(connection.data, appConfig.encryptionKey).toString(enc)
      );

      expect(formattedData).toStrictEqual(expectedDecryptedValue);
      expect(connection.data).not.toEqual(formattedData);
    });

    it('should encrypt formattedData and remove formattedData', async () => {
      vi.spyOn(Connection.prototype, 'eligibleForEncryption').mockReturnValue(
        true
      );

      const formattedData = {
        key: 'value',
      };

      const connection = new Connection();
      connection.formattedData = formattedData;
      connection.encryptData();

      expect(connection.formattedData).not.toBeDefined();
    });
  });

  describe('decryptData', () => {
    it('should return undefined if eligibleForDecryption is not true', () => {
      vi.spyOn(Connection.prototype, 'eligibleForDecryption').mockReturnValue(
        false
      );

      const connection = new Connection();

      expect(connection.decryptData()).toBeUndefined();
    });

    it('should decrypt data and set it to formattedData', async () => {
      vi.spyOn(Connection.prototype, 'eligibleForDecryption').mockReturnValue(
        true
      );

      const formattedData = {
        key: 'value',
      };

      const data = AES.encrypt(
        JSON.stringify(formattedData),
        appConfig.encryptionKey
      ).toString();

      const connection = new Connection();
      connection.data = data;
      connection.decryptData();

      expect(connection.formattedData).toStrictEqual(formattedData);
      expect(connection.data).not.toEqual(formattedData);
    });
  });

  describe('eligibleForEncryption', () => {
    it('should access formattedData', async () => {
      const connection = new Connection();
      connection.formattedData = { clientId: 'sample-id' };

      const spy = vi.spyOn(connection, 'formattedData', 'get');

      connection.eligibleForEncryption();

      expect(spy).toHaveBeenCalledOnce();
    });

    it('should return true when formattedData property exists', async () => {
      const connection = new Connection();
      connection.formattedData = { clientId: 'sample-id' };

      expect(connection.eligibleForEncryption()).toBe(true);
    });

    it("should return false when formattedData property doesn't exist", async () => {
      const connection = new Connection();
      connection.formattedData = undefined;

      expect(connection.eligibleForEncryption()).toBe(false);
    });
  });

  describe('eligibleForDecryption', () => {
    it('should access formattedData', async () => {
      const connection = new Connection();
      connection.data = 'encrypted-data';

      const spy = vi.spyOn(connection, 'data', 'get');

      connection.eligibleForDecryption();

      expect(spy).toHaveBeenCalledOnce();
    });

    it('should return true when data property exists', async () => {
      const connection = new Connection();
      connection.data = 'encrypted-data';

      expect(connection.eligibleForDecryption()).toBe(true);
    });

    it("should return false when data property doesn't exist", async () => {
      const connection = new Connection();
      connection.data = undefined;

      expect(connection.eligibleForDecryption()).toBe(false);
    });
  });

  describe('getApp', () => {
    it('should return connection app when valid key exists', async () => {
      const connection = new Connection();
      connection.key = 'gitlab';

      const connectionApp = await connection.getApp();
      const app = await App.findOneByKey('gitlab');

      expect(connectionApp).toStrictEqual(app);
    });

    it('should throw an error when invalid key exists', async () => {
      const connection = new Connection();
      connection.key = 'invalid-key';

      await expect(() => connection.getApp()).rejects.toThrowError(
        `An application with the "invalid-key" key couldn't be found.`
      );
    });

    it('should return null when no key exists', async () => {
      const connection = new Connection();

      await expect(connection.getApp()).resolves.toBe(null);
    });
  });

  it('getAppConfig should return connection app config', async () => {
    const connection = new Connection();
    connection.key = 'gitlab';

    const appConfig = await createAppConfig({ key: 'gitlab' });

    const connectionAppConfig = await connection.getAppConfig();

    expect(connectionAppConfig).toStrictEqual(appConfig);
  });

  describe.todo('checkEligibilityForCreation', async () => {});

  describe('testAndUpdateConnection', () => {
    it('should verify connection and persist it', async () => {
      const connection = await createConnection({ verified: false });

      const isStillVerifiedSpy = vi.fn().mockReturnValue(true);

      const originalApp = await connection.getApp();

      const getAppSpy = vi
        .spyOn(connection, 'getApp')
        .mockImplementation(() => {
          return {
            ...originalApp,
            auth: {
              ...originalApp.auth,
              isStillVerified: isStillVerifiedSpy,
            },
          };
        });

      const updatedConnection = await connection.testAndUpdateConnection();

      expect(getAppSpy).toHaveBeenCalledOnce();
      expect(isStillVerifiedSpy).toHaveBeenCalledOnce();
      expect(updatedConnection.verified).toBe(true);
    });

    it.todo('should unverify connection and persist it');
  });

  describe('verifyAndUpdateConnection', () => {
    it('should verify connection with valid token', async () => {
      const connection = await createConnection({
        verified: false,
        draft: true,
      });

      const verifyCredentialsSpy = vi.fn().mockResolvedValue(true);

      const originalApp = await connection.getApp();

      vi.spyOn(connection, 'getApp').mockImplementation(() => {
        return {
          ...originalApp,
          auth: {
            ...originalApp.auth,
            verifyCredentials: verifyCredentialsSpy,
          },
        };
      });

      const updatedConnection = await connection.verifyAndUpdateConnection();

      expect(verifyCredentialsSpy).toHaveBeenCalledOnce();
      expect(updatedConnection.verified).toBe(true);
      expect(updatedConnection.draft).toBe(false);
    });

    it('should throw an error with invalid token', async () => {
      const connection = await createConnection({
        verified: false,
        draft: true,
      });

      const verifyCredentialsSpy = vi
        .fn()
        .mockRejectedValue(new Error('Invalid token!'));

      const originalApp = await connection.getApp();

      vi.spyOn(connection, 'getApp').mockImplementation(() => {
        return {
          ...originalApp,
          auth: {
            ...originalApp.auth,
            verifyCredentials: verifyCredentialsSpy,
          },
        };
      });

      await expect(() =>
        connection.verifyAndUpdateConnection()
      ).rejects.toThrowError('Invalid token!');
      expect(verifyCredentialsSpy).toHaveBeenCalledOnce();
    });
  });

  describe('verifyWebhook', () => {
    it('should verify webhook on remote', async () => {
      const connection = await createConnection({ key: 'typeform' });

      const verifyWebhookSpy = vi.fn().mockResolvedValue('verified-webhook');

      const originalApp = await connection.getApp();

      vi.spyOn(connection, 'getApp').mockImplementation(() => {
        return {
          ...originalApp,
          auth: {
            ...originalApp.auth,
            verifyWebhook: verifyWebhookSpy,
          },
        };
      });

      expect(await connection.verifyWebhook()).toBe('verified-webhook');
    });

    it('should return true if connection does not have value in key property', async () => {
      const connection = await createConnection({ key: null });

      expect(await connection.verifyWebhook()).toBe(true);
    });
  });
});
