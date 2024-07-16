import { describe, it, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../../../app.js';
import { createUser } from '../../../../../test/factories/user';

describe('POST /api/v1/users/forgot-password', () => {
  let currentUser;

  beforeEach(async () => {
    currentUser = await createUser();
  });

  it('should respond with no content', async () => {
    await request(app)
      .post('/api/v1/users/forgot-password')
      .send({
        email: currentUser.email,
      })
      .expect(204);
  });

  it('should return not found response for not existing user UUID', async () => {
    await request(app)
      .post('/api/v1/users/forgot-password')
      .send({
        email: 'nonexisting@automatisch.io',
      })
      .expect(404);
  });
});
