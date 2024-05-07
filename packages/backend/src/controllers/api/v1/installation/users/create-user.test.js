import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../../../../app.js';
import Config from '../../../../../models/config.js';
import User from '../../../../../models/user.js';
import { createRole } from '../../../../../../test/factories/role';
import { createInstallationCompletedConfig } from '../../../../../../test/factories/config';

describe('POST /api/v1/installation/users', () => {
  let adminRole;

  beforeEach(async () => {
    adminRole = await createRole({
      name: 'Admin',
      key: 'admin',
    })
  });

  describe('for incomplete installations', () => {
    it('should respond with HTTP 204 with correct payload', async () => {
      expect(await Config.isInstallationCompleted()).toBe(false);

      await request(app)
        .post('/api/v1/installation/users')
        .send({
          email: 'user@automatisch.io',
          password: 'password',
          fullName: 'Initial admin'
        })
        .expect(204);

      const user = await User.query().findOne({ email: 'user@automatisch.io' });

      expect(user.roleId).toBe(adminRole.id);
      expect(await Config.isInstallationCompleted()).toBe(true);
    });
  });

  describe('for completed installations', () => {
    beforeEach(async () => {
      await createInstallationCompletedConfig();
    });

    it('should respond with HTTP 403 when installation completed', async () => {
      expect(await Config.isInstallationCompleted()).toBe(true);

      await request(app)
        .post('/api/v1/installation/users')
        .send({
          email: 'user@automatisch.io',
          password: 'password',
          fullName: 'Initial admin'
        })
        .expect(403);

      const user = await User.query().findOne({ email: 'user@automatisch.io' });

      expect(user).toBeUndefined();
      expect(await Config.isInstallationCompleted()).toBe(true);
    });
  })
});
