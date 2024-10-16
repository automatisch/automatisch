import { describe, it, expect, vi } from 'vitest';
import AES from 'crypto-js/aes.js';
import enc from 'crypto-js/enc-utf8.js';
import appConfig from '../config/app.js';
import AppAuthClient from './app-auth-client.js';
import AppConfig from './app-config.js';
import Base from './base.js';
import Connection from './connection';
import Step from './step.js';
import User from './user.js';

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

  it('relationMappings should return correct associations', () => {
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
});
