import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../../../../../app.js';
import Config from '../../../../../../models/config.js';
import User from '../../../../../../models/user.js';
import { createRole } from '../../../../../../../test/factories/role';
import { createUser } from '../../../../../../../test/factories/user';
import { markInstallationCompleted } from '../../../../../../../test/factories/config';

describe('POST /internal/api/v1/installation/users', () => {
  let adminRole;

  beforeEach(async () => {
    adminRole = await createRole({
      name: 'Admin',
    });
  });

  describe('for incomplete installations', () => {
    it('should respond with HTTP 204 with correct payload when no user', async () => {
      expect(await Config.isInstallationCompleted()).toBe(false);

      await request(app)
        .post('/internal/api/v1/installation/users')
        .send({
          email: 'user@automatisch.io',
          password: 'password',
          fullName: 'Initial admin',
        })
        .expect(204);

      const user = await User.query().findOne({ email: 'user@automatisch.io' });

      expect(user.roleId).toBe(adminRole.id);
      expect(await Config.isInstallationCompleted()).toBe(true);
    });

    it('should respond with HTTP 403 with correct payload when one user exists at least', async () => {
      expect(await Config.isInstallationCompleted()).toBe(false);

      await createUser();

      const usersCountBefore = await User.query().resultSize();

      await request(app)
        .post('/internal/api/v1/installation/users')
        .send({
          email: 'user@automatisch.io',
          password: 'password',
          fullName: 'Initial admin',
        })
        .expect(403);

      const usersCountAfter = await User.query().resultSize();

      expect(usersCountBefore).toStrictEqual(usersCountAfter);
    });
  });

  describe('for completed installations', () => {
    beforeEach(async () => {
      await markInstallationCompleted();
    });

    it('should respond with HTTP 403 when installation completed', async () => {
      expect(await Config.isInstallationCompleted()).toBe(true);

      await request(app)
        .post('/internal/api/v1/installation/users')
        .send({
          email: 'user@automatisch.io',
          password: 'password',
          fullName: 'Initial admin',
        })
        .expect(403);

      const user = await User.query().findOne({ email: 'user@automatisch.io' });

      expect(user).toBeUndefined();
      expect(await Config.isInstallationCompleted()).toBe(true);
    });
  });
});
