import { describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import app from '../../../../../app.js';
import axios from '../../../../../helpers/axios-with-proxy.js';
import appConfig from '../../../../../config/app.js';

describe('GET /internal/api/v1/automatisch/notifications', () => {
  it('should return Automatisch notifications', async () => {
    await request(app)
      .get('/internal/api/v1/automatisch/notifications')
      .expect(200);
  });

  it('should use Automatisch notifications URL when Mation is not enabled', async () => {
    const AUTOMATISCH_NOTIFICATIONS_URL =
      'https://notifications.automatisch.io/notifications.json';

    vi.spyOn(axios, 'get').mockResolvedValueOnce({
      data: [],
    });

    await request(app)
      .get('/internal/api/v1/automatisch/notifications')
      .expect(200);

    expect(axios.get).toHaveBeenCalledWith(AUTOMATISCH_NOTIFICATIONS_URL);
  });

  it('should use Mation notifications URL when Mation is enabled', async () => {
    vi.spyOn(appConfig, 'isMation', 'get').mockReturnValue(true);

    const MATION_NOTIFICATIONS_URL =
      'https://notifications.mation.work/notifications.json';

    vi.spyOn(axios, 'get').mockResolvedValueOnce({
      data: [],
    });

    await request(app)
      .get('/internal/api/v1/automatisch/notifications')
      .expect(200);

    expect(axios.get).toHaveBeenCalledWith(MATION_NOTIFICATIONS_URL);
  });

  it('should return no notifications when Automatisch notifications are not available', async () => {
    vi.spyOn(axios, 'get').mockRejectedValueOnce();

    const response = await request(app)
      .get('/internal/api/v1/automatisch/notifications')
      .expect(200);

    expect(response.body.data).toStrictEqual([]);
  });
});
