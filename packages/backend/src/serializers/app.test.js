import { describe, it, expect } from 'vitest';
import App from '../models/app';
import appSerializer from './app';

describe('appSerializer', () => {
  it('should return app data', async () => {
    const app = await App.findOneByKey('deepl');

    const expectedPayload = {
      name: app.name,
      key: app.key,
      iconUrl: app.iconUrl,
      authDocUrl: app.authDocUrl,
      supportsConnections: app.supportsConnections,
      primaryColor: app.primaryColor,
    };

    expect(appSerializer(app)).toEqual(expectedPayload);
  });
});
