import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../../../app.js';
import appConfig from '../../../../config/app.js';

describe('GET /api/v1/automatisch/version', () => {
  it('should return Automatisch version', async () => {
    const response = await request(app)
      .get('/api/v1/automatisch/version')
      .expect(200);

    expect(response.body).toEqual({ version: appConfig.version });
  });
});
