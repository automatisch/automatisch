import { vi, describe, it, expect } from 'vitest';

import Base from './base.js';
import AppConfig from './app-config.js';
import App from './app.js';
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

  describe('getApp', () => {
    it('getApp should return null if there is no key', async () => {
      const appConfig = new AppConfig();
      const app = await appConfig.getApp();

      expect(app).toBeNull();
    });

    it('getApp should return app with provided key', async () => {
      const appConfig = new AppConfig();
      appConfig.key = 'deepl';

      const app = await appConfig.getApp();
      const expectedApp = await App.findOneByKey(appConfig.key);

      expect(app).toStrictEqual(expectedApp);
    });
  });

  describe('updateConnectionAllowedProperty', () => {
    it('should call computeConnectionAllowedProperty and patch the result', async () => {
      const appConfig = await createAppConfig();

      const computeConnectionAllowedPropertySpy = vi
        .spyOn(appConfig, 'computeConnectionAllowedProperty')
        .mockResolvedValue(true);

      const patchSpy = vi
        .fn()
        .mockImplementation((newAppConfig) => newAppConfig);

      vi.spyOn(appConfig, '$query').mockImplementation(() => ({
        patch: patchSpy,
      }));

      await appConfig.updateConnectionAllowedProperty();

      expect(computeConnectionAllowedPropertySpy).toHaveBeenCalled();
      expect(patchSpy).toHaveBeenCalledWith({
        connectionAllowed: true,
      });
    });
  });

  describe('computeAndAssignConnectionAllowedProperty', () => {
    it('should call computeConnectionAllowedProperty and assign the result', async () => {
      const appConfig = await createAppConfig();

      const computeConnectionAllowedPropertySpy = vi
        .spyOn(appConfig, 'computeConnectionAllowedProperty')
        .mockResolvedValue(true);

      await appConfig.computeAndAssignConnectionAllowedProperty();

      expect(computeConnectionAllowedPropertySpy).toHaveBeenCalled();
      expect(appConfig.connectionAllowed).toBe(true);
    });
  });

  describe('computeConnectionAllowedProperty', () => {
    it('should return true when app is enabled, shared and allows custom connection with an active app auth client', async () => {
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
        customConnectionAllowed: true,
        shared: true,
        key: 'deepl',
      });

      const connectionAllowed =
        await appConfig.computeConnectionAllowedProperty();

      expect(connectionAllowed).toBe(true);
    });

    it('should return false if there is no active app auth client', async () => {
      await createAppAuthClient({
        appKey: 'deepl',
        active: false,
      });

      const appConfig = await createAppConfig({
        disabled: false,
        customConnectionAllowed: true,
        shared: true,
        key: 'deepl',
      });

      const connectionAllowed =
        await appConfig.computeConnectionAllowedProperty();

      expect(connectionAllowed).toBe(false);
    });

    it('should return false if there is no app auth clients', async () => {
      const appConfig = await createAppConfig({
        disabled: false,
        customConnectionAllowed: true,
        shared: true,
        key: 'deepl',
      });

      const connectionAllowed =
        await appConfig.computeConnectionAllowedProperty();

      expect(connectionAllowed).toBe(false);
    });

    it('should return false when app is disabled', async () => {
      const appConfig = await createAppConfig({
        disabled: true,
        customConnectionAllowed: true,
      });

      const connectionAllowed =
        await appConfig.computeConnectionAllowedProperty();

      expect(connectionAllowed).toBe(false);
    });

    it(`should return false when app doesn't allow custom connection`, async () => {
      const appConfig = await createAppConfig({
        disabled: false,
        customConnectionAllowed: false,
      });

      const connectionAllowed =
        await appConfig.computeConnectionAllowedProperty();

      expect(connectionAllowed).toBe(false);
    });
  });

  it('$beforeInsert should call computeAndAssignConnectionAllowedProperty', async () => {
    const computeAndAssignConnectionAllowedPropertySpy = vi
      .spyOn(AppConfig.prototype, 'computeAndAssignConnectionAllowedProperty')
      .mockResolvedValue(true);

    await createAppConfig();

    expect(computeAndAssignConnectionAllowedPropertySpy).toHaveBeenCalledOnce();
  });

  it('$beforeUpdate should call computeAndAssignConnectionAllowedProperty', async () => {
    const appConfig = await createAppConfig();

    const computeAndAssignConnectionAllowedPropertySpy = vi
      .spyOn(AppConfig.prototype, 'computeAndAssignConnectionAllowedProperty')
      .mockResolvedValue(true);

    await appConfig.$query().patch({
      key: 'deepl',
    });

    expect(computeAndAssignConnectionAllowedPropertySpy).toHaveBeenCalledOnce();
  });
});
