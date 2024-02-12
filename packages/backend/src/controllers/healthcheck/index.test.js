import { describe, it } from 'vitest';
import request from 'supertest';
import app from '../../app.js';

describe('GET /healthcheck', () => {
  it('should return 200 response with version data', async () => {
    await request(app).get('/healthcheck').expect(200);
  });
});
