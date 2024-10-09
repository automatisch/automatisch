import { describe, it, expect } from 'vitest';

import Base from './base.js';
import AppConfig from './app-config.js';
import AppAuthClient from './app-auth-client.js';
import { createAppConfig } from '../../test/factories/app-config.js';
import { createAppAuthClient } from '../../test/factories/app-auth-client.js';

describe('AppConfig model', () => {
  it('tableName should return correct name', () => {
    expect(AppConfig.tableName).toBe('app_configs');
  });

  it('jsonSchema should have correct validations', () => {
    expect(AppConfig.jsonSchema).toMatchSnapshot();
  });

  it('relationMappings should return correct associations', () => {
    const relationMappings = AppConfig.relationMappings();

    const expectedRelations = {
      appAuthClients: {
        relation: Base.HasManyRelation,
        modelClass: AppAuthClient,
        join: {
          from: 'app_configs.key',
          to: 'app_auth_clients.app_key',
        },
      },
    };

    expect(relationMappings).toStrictEqual(expectedRelations);
  });

  it('virtualAttributes should return correct properties', () => {
    expect(AppConfig.virtualAttributes).toMatchSnapshot();
  });

  describe('allowCustomConnection', () => {
    it('should return true when app is enabled and allows custom connection', async () => {
      const appConfig = await createAppConfig({
        disabled: false,
        allowCustomConnection: true,
      });

      expect(appConfig.allowCustomConnection).toBe(true);
    });

    it('should return false when app is disabled', async () => {
      const appConfig = await createAppConfig({
        disabled: true,
        allowCustomConnection: true,
      });

      expect(appConfig.allowCustomConnection).toBe(false);
    });

    it(`should return false when app doesn't allow custom connection`, async () => {
      const appConfig = await createAppConfig({
        disabled: false,
        allowCustomConnection: false,
      });

      expect(appConfig.allowCustomConnection).toBe(false);
    });
  });

  describe('connectionAllowed', () => {
    it('should return true when app is enabled, shared and allows custom connection with an active app auth client at least', async () => {
      await createAppAuthClient({
        appKey: 'deepl',
        active: true,
      });

      await createAppAuthClient({
        appKey: 'deepl',
        active: false,
      });

      const appConfig = await createAppConfig({
        disabled: false,
        allowCustomConnection: true,
        shared: true,
        key: 'deepl',
      });

      expect(appConfig.connectionAllowed).toBe(true);
    });

    it('should return true when app is enabled, shared and allows custom connection with no active app auth client', async () => {
      await createAppAuthClient({
        appKey: 'deepl',
        active: false,
      });

      const appConfig = await createAppConfig({
        disabled: false,
        allowCustomConnection: true,
        shared: true,
        key: 'deepl',
      });

      expect(appConfig.connectionAllowed).toBe(false);
    });

    it('should return false when app is enabled, shared and allows custom connection without any app auth clients', async () => {
      const appConfig = await createAppConfig({
        disabled: false,
        allowCustomConnection: true,
        shared: true,
        key: 'deepl',
      });

      expect(appConfig.connectionAllowed).toBe(false);
    });

    it('should return false when app is disabled', async () => {
      const appConfig = await createAppConfig({
        disabled: true,
        allowCustomConnection: true,
      });

      expect(appConfig.connectionAllowed).toBe(false);
    });

    it(`should return false when app doesn't allow custom connection`, async () => {
      const appConfig = await createAppConfig({
        disabled: false,
        allowCustomConnection: false,
      });

      expect(appConfig.connectionAllowed).toBe(false);
    });
  });

  it('getApp should return associated application', async () => {
    const appConfig = await createAppConfig({ key: 'deepl' });

    const app = await appConfig.getApp();

    expect(app.key).toBe('deepl');
  });
});
