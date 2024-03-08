import { vi, expect, describe, it } from 'vitest';
import request from 'supertest';
import { createConfig } from '../../../../../test/factories/config.js';
import app from '../../../../app.js';
import configMock from '../../../../../test/mocks/rest/api/v1/automatisch/config.js';
import * as license from '../../../../helpers/license.ee.js';

describe('GET /api/v1/automatisch/config', () => {
  it('should return Automatisch config', async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    const logoConfig = await createConfig({
      key: 'logo.svgData',
      value: { data: '<svg>Sample</svg>' },
    });

    const primaryDarkConfig = await createConfig({
      key: 'palette.primary.dark',
      value: { data: '#001F52' },
    });

    const primaryLightConfig = await createConfig({
      key: 'palette.primary.light',
      value: { data: '#4286FF' },
    });

    const primaryMainConfig = await createConfig({
      key: 'palette.primary.main',
      value: { data: '#0059F7' },
    });

    const titleConfig = await createConfig({
      key: 'title',
      value: { data: 'Sample Title' },
    });

    const response = await request(app)
      .get('/api/v1/automatisch/config')
      .expect(200);

    const expectedPayload = configMock(
      logoConfig,
      primaryDarkConfig,
      primaryLightConfig,
      primaryMainConfig,
      titleConfig
    );

    expect(response.body).toEqual(expectedPayload);
  });
});
