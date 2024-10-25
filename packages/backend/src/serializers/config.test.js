import { describe, it, expect, beforeEach } from 'vitest';
import { getConfig } from '../../test/factories/config';
import configSerializer from './config';

describe('configSerializer', () => {
  let config;

  beforeEach(async () => {
    config = await getConfig();
  });

  it('should return config data', async () => {
    const expectedPayload = {
      id: config.id,
      disableFavicon: config.disableFavicon,
      disableNotificationsPage: config.disableNotificationsPage,
      logoSvgData: config.logoSvgData,
      palettePrimaryDark: config.palettePrimaryDark,
      palettePrimaryMain: config.palettePrimaryMain,
      palettePrimaryLight: config.palettePrimaryLight,
      installationCompleted: config.installationCompleted,
      title: config.title,
      additionalDrawerLink: config.additionalDrawerLink,
      additionalDrawerLinkIcon: config.additionalDrawerLinkIcon,
      additionalDrawerLinkText: config.additionalDrawerLinkText,
      createdAt: config.createdAt.getTime(),
      updatedAt: config.updatedAt.getTime(),
    };

    expect(configSerializer(config)).toStrictEqual(expectedPayload);
  });
});
