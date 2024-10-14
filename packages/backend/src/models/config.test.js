import { describe, it, expect, vi } from 'vitest';
import appConfig from '../config/app.js';
import Config from './config';
import { createConfig } from '../../test/factories/config.js';

describe('Config model', () => {
  it('tableName should return correct name', () => {
    expect(Config.tableName).toBe('config');
  });

  it('jsonSchema should have correct validations', () => {
    expect(Config.jsonSchema).toMatchSnapshot();
  });

  it('virtualAttributes should return correct attributes', () => {
    const virtualAttributes = Config.virtualAttributes;

    const expectedAttributes = [
      'disableNotificationsPage',
      'disableFavicon',
      'additionalDrawerLink',
      'additionalDrawerLinkIcon',
      'additionalDrawerLinkText',
    ];

    expect(virtualAttributes).toStrictEqual(expectedAttributes);
  });

  it('disableNotificationsPage should return its value in appConfig', async () => {
    const disableNotificationsPageSpy = vi.spyOn(
      appConfig,
      'disableNotificationsPage',
      'get'
    );

    new Config().disableNotificationsPage;

    expect(disableNotificationsPageSpy).toHaveBeenCalledOnce();
  });

  it('disableFavicon should return its value in appConfig', async () => {
    const disableFaviconSpy = vi
      .spyOn(appConfig, 'disableFavicon', 'get')
      .mockReturnValue(true);

    new Config().disableFavicon;

    expect(disableFaviconSpy).toHaveBeenCalledOnce();
  });

  it('additionalDrawerLink should return its value in appConfig', async () => {
    const additionalDrawerLinkSpy = vi
      .spyOn(appConfig, 'additionalDrawerLink', 'get')
      .mockReturnValue('https://automatisch.io');

    new Config().additionalDrawerLink;

    expect(additionalDrawerLinkSpy).toHaveBeenCalledOnce();
  });

  it('additionalDrawerLinkIcon should return its value in appConfig', async () => {
    const additionalDrawerLinkIconSpy = vi
      .spyOn(appConfig, 'additionalDrawerLinkIcon', 'get')
      .mockReturnValue('SampleIcon');

    new Config().additionalDrawerLinkIcon;

    expect(additionalDrawerLinkIconSpy).toHaveBeenCalledOnce();
  });

  it('additionalDrawerLinkText should return its value in appConfig', async () => {
    const additionalDrawerLinkTextSpy = vi
      .spyOn(appConfig, 'additionalDrawerLinkText', 'get')
      .mockReturnValue('Go back to Automatisch');

    new Config().additionalDrawerLinkText;

    expect(additionalDrawerLinkTextSpy).toHaveBeenCalledOnce();
  });

  describe('get', () => {
    it('should return single config record when it exists', async () => {
      const createdConfig = await createConfig({
        title: 'Automatisch',
      });

      const config = await Config.get();

      expect(config).toStrictEqual(createdConfig);
    });

    it('should create config record and return when it does not exist', async () => {
      const configBefore = await Config.query().first();

      expect(configBefore).toBeUndefined();

      const config = await Config.get();

      expect(config).toBeTruthy();
    });
  });

  it('update should update existing single record', async () => {
    const patchAndFetchSpy = vi
      .fn()
      .mockImplementation((newConfig) => newConfig);

    vi.spyOn(Config, 'get').mockImplementation(() => ({
      $query: () => ({
        patchAndFetch: patchAndFetchSpy,
      }),
    }));

    const config = await Config.update({ title: 'Automatisch' });

    expect(patchAndFetchSpy).toHaveBeenCalledWith({ title: 'Automatisch' });
    expect(config).toStrictEqual({ title: 'Automatisch' });
  });

  it('isInstallationCompleted should return installationCompleted value', async () => {
    const configGetSpy = vi.spyOn(Config, 'get').mockImplementation(() => ({
      installationCompleted: true,
    }));

    await Config.isInstallationCompleted();

    expect(configGetSpy).toHaveBeenCalledOnce();
  });

  it('markInstallationCompleted should update installationCompleted as true', async () => {
    await Config.update({ installationCompleted: false });

    const config = await Config.markInstallationCompleted();

    expect(config.installationCompleted).toBe(true);
  });
});
