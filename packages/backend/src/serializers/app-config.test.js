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
      key: appConfig.key,
      useOnlyPredefinedAuthClients: appConfig.useOnlyPredefinedAuthClients,
      disabled: appConfig.disabled,
      createdAt: appConfig.createdAt.getTime(),
      updatedAt: appConfig.updatedAt.getTime(),
    };

    expect(appConfigSerializer(appConfig)).toStrictEqual(expectedPayload);
  });
});
