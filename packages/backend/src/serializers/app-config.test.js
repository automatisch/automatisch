import { describe, it, expect, beforeEach } from 'vitest';
import { createAppConfig } from '../../test/factories/app-config';
import appConfigSerializer from './app-config';

describe('appConfig serializer', () => {
  let appConfig;

  beforeEach(async () => {
    appConfig = await createAppConfig();
  });

  it('should return app config data', async () => {
    const expectedPayload = {
      id: appConfig.id,
      key: appConfig.key,
      allowCustomConnection: appConfig.allowCustomConnection,
      shared: appConfig.shared,
      disabled: appConfig.disabled,
      connectionAllowed: appConfig.connectionAllowed,
      canCustomConnect: appConfig.canCustomConnect,
      createdAt: appConfig.createdAt.getTime(),
      updatedAt: appConfig.updatedAt.getTime(),
    };

    expect(appConfigSerializer(appConfig)).toEqual(expectedPayload);
  });
});
