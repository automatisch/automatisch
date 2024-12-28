import { describe, it, expect, vi } from 'vitest';
import AES from 'crypto-js/aes.js';
import enc from 'crypto-js/enc-utf8.js';
import appConfig from '../config/app.js';
import OAuthClient from './oauth-client.js';
import App from './app.js';
import AppConfig from './app-config.js';
import Base from './base.js';
import Connection from './connection';
import Step from './step.js';
import User from './user.js';
import Telemetry from '../helpers/telemetry/index.js';
import { createConnection } from '../../test/factories/connection.js';
import { createAppConfig } from '../../test/factories/app-config.js';
import { createOAuthClient } from '../../test/factories/oauth-client.js';

describe('Connection model', () => {
  it('tableName should return correct name', () => {
    expect(Connection.tableName).toBe('connections');
  });

  it('jsonSchema should have correct validations', () => {
    expect(Connection.jsonSchema).toMatchSnapshot();
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
        oauthClient: {
          relation: Base.BelongsToOneRelation,
          modelClass: OAuthClient,
          join: {
            from: 'connections.oauth_client_id',
            to: 'oauth_clients.id',
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
      expect(connection.data).not.toStrictEqual(formattedData);
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
      expect(connection.data).not.toStrictEqual(formattedData);
    });
  });

  describe('eligibleForEncryption', () => {
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

  describe('checkEligibilityForCreation', () => {
    it('should return connection if no app config exists', async () => {
      vi.spyOn(Connection.prototype, 'getApp').mockResolvedValue({
        name: 'gitlab',
      });

      vi.spyOn(Connection.prototype, 'getAppConfig').mockResolvedValue();

      const connection = new Connection();

      expect(await connection.checkEligibilityForCreation()).toBe(connection);
    });

    it('should throw an error when app does not exist', async () => {
      vi.spyOn(Connection.prototype, 'getApp').mockRejectedValue(
        new Error(
          `An application with the "unexisting-app" key couldn't be found.`
        )
      );

      vi.spyOn(Connection.prototype, 'getAppConfig').mockResolvedValue();

      const connection = new Connection();

      await expect(() =>
        connection.checkEligibilityForCreation()
      ).rejects.toThrow(
        `An application with the "unexisting-app" key couldn't be found.`
      );
    });

    it('should throw an error when app config is disabled', async () => {
      vi.spyOn(Connection.prototype, 'getApp').mockResolvedValue({
        name: 'gitlab',
      });

      vi.spyOn(Connection.prototype, 'getAppConfig').mockResolvedValue({
        disabled: true,
      });

      const connection = new Connection();

      await expect(() =>
        connection.checkEligibilityForCreation()
      ).rejects.toThrow(
        'The application has been disabled for new connections!'
      );
    });

    // TODO: update test case name
    it('should throw an error when app config does not allow custom connection with formatted data', async () => {
      vi.spyOn(Connection.prototype, 'getApp').mockResolvedValue({
        name: 'gitlab',
      });

      vi.spyOn(Connection.prototype, 'getAppConfig').mockResolvedValue({
        disabled: false,
        useOnlyPredefinedAuthClients: true,
      });

      const connection = new Connection();
      connection.formattedData = {};

      await expect(() =>
        connection.checkEligibilityForCreation()
      ).rejects.toThrow(
        'New custom connections have been disabled for gitlab!'
      );
    });

    it('should apply oauth client auth defaults when creating with shared oauth client', async () => {
      await createAppConfig({
        key: 'gitlab',
        disabled: false,
      });

      const oauthClient = await createOAuthClient({
        appKey: 'gitlab',
        active: true,
        formattedAuthDefaults: {
          clientId: 'sample-id',
        },
      });

      const connection = await createConnection({
        key: 'gitlab',
        oauthClientId: oauthClient.id,
        formattedData: null,
      });

      await connection.checkEligibilityForCreation();

      expect(connection.formattedData).toStrictEqual({
        clientId: 'sample-id',
      });
    });
  });

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

    it('should unverify connection and persist it', async () => {
      const connection = await createConnection({ verified: true });

      const isStillVerifiedSpy = vi
        .fn()
        .mockRejectedValue(new Error('Wrong credentials!'));

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
      expect(updatedConnection.verified).toBe(false);
    });
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

    it('should throw an error at failed webhook verification', async () => {
      const connection = await createConnection({ key: 'typeform' });

      const verifyWebhookSpy = vi.fn().mockRejectedValue('unverified-webhook');

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

      await expect(() => connection.verifyWebhook()).rejects.toThrowError(
        'unverified-webhook'
      );
    });
  });

  it('generateAuthUrl should return authentication url', async () => {
    const connection = await createConnection({
      key: 'typeform',
      formattedData: {
        url: 'https://automatisch.io/authentication-url',
      },
    });

    const generateAuthUrlSpy = vi.fn();

    const originalApp = await connection.getApp();

    vi.spyOn(connection, 'getApp').mockImplementation(() => {
      return {
        ...originalApp,
        auth: {
          ...originalApp.auth,
          generateAuthUrl: generateAuthUrlSpy,
        },
      };
    });

    expect(await connection.generateAuthUrl()).toStrictEqual({
      url: 'https://automatisch.io/authentication-url',
    });
  });

  describe('reset', () => {
    it('should keep screen name when exists and reset the rest of the formatted data', async () => {
      const connection = await createConnection({
        formattedData: {
          screenName: 'Sample connection',
          token: 'sample-token',
        },
      });

      await connection.reset();

      const refetchedConnection = await connection.$query();

      expect(refetchedConnection.formattedData).toStrictEqual({
        screenName: 'Sample connection',
      });
    });

    it('should empty formatted data object when screen name does not exist', async () => {
      const connection = await createConnection({
        formattedData: {
          token: 'sample-token',
        },
      });

      await connection.reset();

      const refetchedConnection = await connection.$query();

      expect(refetchedConnection.formattedData).toStrictEqual({});
    });
  });

  describe('updateFormattedData', () => {
    it('should extend connection data with oauth client auth defaults', async () => {
      const oauthClient = await createOAuthClient({
        formattedAuthDefaults: {
          clientId: 'sample-id',
        },
      });

      const connection = await createConnection({
        oauthClientId: oauthClient.id,
        formattedData: {
          token: 'sample-token',
        },
      });

      const updatedConnection = await connection.updateFormattedData({
        oauthClientId: oauthClient.id,
      });

      expect(updatedConnection.formattedData).toStrictEqual({
        clientId: 'sample-id',
        token: 'sample-token',
      });
    });
  });

  describe('$beforeInsert', () => {
    it('should call super.$beforeInsert', async () => {
      const superBeforeInsertSpy = vi
        .spyOn(Base.prototype, '$beforeInsert')
        .mockResolvedValue();

      await createConnection();

      expect(superBeforeInsertSpy).toHaveBeenCalledOnce();
    });

    it('should call checkEligibilityForCreation', async () => {
      const checkEligibilityForCreationSpy = vi
        .spyOn(Connection.prototype, 'checkEligibilityForCreation')
        .mockResolvedValue();

      await createConnection();

      expect(checkEligibilityForCreationSpy).toHaveBeenCalledOnce();
    });

    it('should call encryptData', async () => {
      const encryptDataSpy = vi
        .spyOn(Connection.prototype, 'encryptData')
        .mockResolvedValue();

      await createConnection();

      expect(encryptDataSpy).toHaveBeenCalledOnce();
    });
  });

  describe('$beforeUpdate', () => {
    it('should call super.$beforeUpdate', async () => {
      const superBeforeUpdateSpy = vi
        .spyOn(Base.prototype, '$beforeUpdate')
        .mockResolvedValue();

      const connection = await createConnection();

      await connection.$query().patch({ verified: false });

      expect(superBeforeUpdateSpy).toHaveBeenCalledOnce();
    });

    it('should call encryptData', async () => {
      const connection = await createConnection();

      const encryptDataSpy = vi
        .spyOn(Connection.prototype, 'encryptData')
        .mockResolvedValue();

      await connection.$query().patch({ verified: false });

      expect(encryptDataSpy).toHaveBeenCalledOnce();
    });
  });

  describe('$afterFind', () => {
    it('should call decryptData', async () => {
      const connection = await createConnection();

      const decryptDataSpy = vi
        .spyOn(Connection.prototype, 'decryptData')
        .mockResolvedValue();

      await connection.$query();

      expect(decryptDataSpy).toHaveBeenCalledOnce();
    });
  });

  describe('$afterInsert', () => {
    it('should call super.$afterInsert', async () => {
      const superAfterInsertSpy = vi.spyOn(Base.prototype, '$afterInsert');

      await createConnection();

      expect(superAfterInsertSpy).toHaveBeenCalledOnce();
    });

    it('should call Telemetry.connectionCreated', async () => {
      const telemetryConnectionCreatedSpy = vi
        .spyOn(Telemetry, 'connectionCreated')
        .mockImplementation(() => {});

      const connection = await createConnection();

      expect(telemetryConnectionCreatedSpy).toHaveBeenCalledWith(connection);
    });
  });

  describe('$afterUpdate', () => {
    it('should call super.$afterUpdate', async () => {
      const superAfterInsertSpy = vi.spyOn(Base.prototype, '$afterUpdate');

      const connection = await createConnection();

      await connection.$query().patch({ verified: false });

      expect(superAfterInsertSpy).toHaveBeenCalledOnce();
    });

    it('should call Telemetry.connectionUpdated', async () => {
      const telemetryconnectionUpdatedSpy = vi
        .spyOn(Telemetry, 'connectionCreated')
        .mockImplementation(() => {});

      const connection = await createConnection();

      await connection.$query().patch({ verified: false });

      expect(telemetryconnectionUpdatedSpy).toHaveBeenCalledWith(connection);
    });
  });
});
