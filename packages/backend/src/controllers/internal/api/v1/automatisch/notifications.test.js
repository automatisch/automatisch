import { describe, it } from 'vitest';
import request from 'supertest';
import app from '../../../../../app.js';

describe('GET /internal/api/v1/automatisch/notifications', () => {
  it('should return Automatisch notifications', async () => {
    await request(app)
      .get('/internal/api/v1/automatisch/notifications')
      .expect(200);
  });
});
