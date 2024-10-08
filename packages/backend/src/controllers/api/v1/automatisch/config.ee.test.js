import { vi, expect, describe, it } from 'vitest';
import request from 'supertest';
import { updateConfig } from '../../../../../test/factories/config.js';
import app from '../../../../app.js';
import configMock from '../../../../../test/mocks/rest/api/v1/automatisch/config.js';
import * as license from '../../../../helpers/license.ee.js';
import appConfig from '../../../../config/app.js';

describe('GET /api/v1/automatisch/config', () => {
  it('should return Automatisch config along with static config', async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);
    vi.spyOn(appConfig, 'disableNotificationsPage', 'get').mockReturnValue(
      true
    );
    vi.spyOn(appConfig, 'disableFavicon', 'get').mockReturnValue(true);
    vi.spyOn(appConfig, 'additionalDrawerLink', 'get').mockReturnValue('link');
    vi.spyOn(appConfig, 'additionalDrawerLinkIcon', 'get').mockReturnValue(
      'icon'
    );
    vi.spyOn(appConfig, 'additionalDrawerLinkText', 'get').mockReturnValue(
      'text'
    );

    const config = await updateConfig({
      logoSvgData: '<svg>Sample</svg>',
      palettePrimaryDark: '#001f52',
      palettePrimaryLight: '#4286FF',
      palettePrimaryMain: '#0059F7',
      title: 'Sample Title',
    });

    const response = await request(app)
      .get('/api/v1/automatisch/config')
      .expect(200);

    const expectedPayload = configMock({
      ...config,
      disableNotificationsPage: true,
      disableFavicon: true,
      additionalDrawerLink: 'link',
      additionalDrawerLinkIcon: 'icon',
      additionalDrawerLinkText: 'text',
    });

    expect(response.body).toStrictEqual(expectedPayload);
  });
});
