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

  describe('canCustomConnect', () => {
    it('should return true when app is enabled and allows custom connection', async () => {
      const appConfig = await createAppConfig({
        disabled: false,
        allowCustomConnection: true,
      });

      expect(appConfig.canCustomConnect).toBe(true);
    });

    it('should return false when app is disabled', async () => {
      const appConfig = await createAppConfig({
        disabled: true,
        allowCustomConnection: true,
      });

      expect(appConfig.canCustomConnect).toBe(false);
    });

    it(`should return false when app doesn't allow custom connection`, async () => {
      const appConfig = await createAppConfig({
        disabled: false,
        allowCustomConnection: false,
      });

      expect(appConfig.canCustomConnect).toBe(false);
    });
  });

  describe('canConnect', () => {
    it('should return true when app is enabled, shared and allows custom connection', async () => {
      await createAppAuthClient({
        appKey: 'deepl',
        active: true,
      });

      let appConfig = await createAppConfig({
        disabled: false,
        allowCustomConnection: true,
        shared: true,
        key: 'deepl',
      });

      appConfig = await appConfig.$query().withGraphFetched({
        appAuthClients: true,
      });

      expect(appConfig.canConnect).toBe(true);
    });

    it('should return false when app is disabled', async () => {
      const appConfig = await createAppConfig({
        disabled: true,
        allowCustomConnection: true,
      });

      expect(appConfig.canConnect).toBe(false);
    });

    it(`should return false when app doesn't allow custom connection`, async () => {
      const appConfig = await createAppConfig({
        disabled: false,
        allowCustomConnection: false,
      });

      expect(appConfig.canConnect).toBe(false);
    });
  });

  it('getApp should return associated application', async () => {
    const appConfig = await createAppConfig({ key: 'deepl' });

    const app = await appConfig.getApp();

    expect(app.key).toBe('deepl');
  });
});
