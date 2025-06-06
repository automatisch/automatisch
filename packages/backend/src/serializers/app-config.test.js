import { describe, it, expect, beforeEach } from 'vitest';
import { createAppConfig } from '@/factories/app-config.js';
import appConfigSerializer from '@/serializers/app-config.js';

describe('appConfig serializer', () => {
  let appConfig;

  beforeEach(async () => {
    appConfig = await createAppConfig();
  });

  it('should return app config data', async () => {
    const expectedPayload = {
      key: appConfig.key,
      useOnlyPredefinedAuthClients: appConfig.useOnlyPredefinedAuthClients,
      disabled: appConfig.disabled,
      createdAt: appConfig.createdAt.getTime(),
      updatedAt: appConfig.updatedAt.getTime(),
    };

    expect(appConfigSerializer(appConfig)).toStrictEqual(expectedPayload);
  });
});
