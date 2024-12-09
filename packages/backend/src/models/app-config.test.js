import { describe, it, expect } from 'vitest';

import Base from './base.js';
import AppConfig from './app-config.js';
import App from './app.js';
import AppAuthClient from './app-auth-client.js';

describe('AppConfig model', () => {
  it('tableName should return correct name', () => {
    expect(AppConfig.tableName).toBe('app_configs');
  });

  it('idColumn should return key field', () => {
    expect(AppConfig.idColumn).toBe('key');
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
});
