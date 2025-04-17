import { vi, expect, describe, it } from 'vitest';
import request from 'supertest';
import appConfig from '../../../../../config/app.js';
import Config from '../../../../../models/config.js';
import app from '../../../../../app.js';
import infoMock from '../../../../../../test/mocks/rest/internal/api/v1/automatisch/info.js';
import * as license from '../../../../../helpers/license.ee.js';

describe('GET /internal/api/v1/automatisch/info', () => {
  it('should return Automatisch info', async () => {
    vi.spyOn(Config, 'isInstallationCompleted').mockResolvedValue(true);
    vi.spyOn(appConfig, 'isCloud', 'get').mockReturnValue(false);
    vi.spyOn(appConfig, 'isMation', 'get').mockReturnValue(false);
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);
    vi.spyOn(appConfig, 'docsUrl', 'get').mockReturnValue(
      'https://automatisch.io/docs'
    );

    const response = await request(app)
      .get('/internal/api/v1/automatisch/info')
      .expect(200);

    const expectedPayload = infoMock();

    expect(response.body).toStrictEqual(expectedPayload);
  });
});
