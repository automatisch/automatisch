import { describe, it, beforeEach } from 'vitest';
import request from 'supertest';
import { DateTime } from 'luxon';
import app from '../../../../app.js';
import { createUser } from '../../../../../test/factories/user';

describe('POST /api/v1/users/reset-password', () => {
  let currentUser;

  beforeEach(async () => {
    currentUser = await createUser({
      resetPasswordToken: 'sampleResetPasswordToken',
      resetPasswordTokenSentAt: DateTime.now().toISO(),
    });
  });

  it('should respond with no content', async () => {
    await request(app)
      .post('/api/v1/users/reset-password')
      .send({
        token: currentUser.resetPasswordToken,
        password: 'newPassword',
      })
      .expect(204);
  });

  it('should return not found response for not existing user', async () => {
    await request(app)
      .post('/api/v1/users/reset-password')
      .send({
        token: 'nonExistingResetPasswordToken',
      })
      .expect(404);
  });

  it('should return unprocessable entity for existing user with expired reset password token', async () => {
    const user = await createUser({
      resetPasswordToken: 'anotherResetPasswordToken',
      resetPasswordTokenSentAt: DateTime.now().minus({ days: 2 }).toISO(),
    });

    await request(app)
      .post('/api/v1/users/reset-password')
      .send({
        token: user.resetPasswordToken,
      })
      .expect(422);
  });
});
