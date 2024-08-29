import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';

import app from '../../../../../app.js';
import createAuthTokenByUserId from '../../../../../helpers/create-auth-token-by-user-id.js';
import { createUser } from '../../../../../../test/factories/user.js';
import { createRole } from '../../../../../../test/factories/role.js';
import { createBulkConfig } from '../../../../../../test/factories/config.js';
import * as license from '../../../../../helpers/license.ee.js';

describe('PATCH /api/v1/admin/config', () => {
  let currentUser, adminRole, token;

  beforeEach(async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    adminRole = await createRole({ key: 'admin' });
    currentUser = await createUser({ roleId: adminRole.id });

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should return updated config', async () => {
    const title = 'Test environment - Automatisch';
    const palettePrimaryMain = '#00adef';
    const palettePrimaryDark = '#222222';
    const palettePrimaryLight = '#f90707';
    const logoSvgData =
      '<svg width="25" height="25" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="white" /><text x="10" y="40" font-family="Arial" font-size="40" fill="black">A</text></svg>';

    const appConfig = {
      title,
      'palette.primary.main': palettePrimaryMain,
      'palette.primary.dark': palettePrimaryDark,
      'palette.primary.light': palettePrimaryLight,
      'logo.svgData': logoSvgData,
    };

    await createBulkConfig(appConfig);

    const newTitle = 'Updated title';

    const newConfigValues = {
      title: newTitle,
    };

    const response = await request(app)
      .patch('/api/v1/admin/config')
      .set('Authorization', token)
      .send(newConfigValues)
      .expect(200);

    expect(response.body.data.title).toEqual(newTitle);
    expect(response.body.meta.type).toEqual('Object');
  });

  it('should return created config for unexisting config', async () => {
    const newTitle = 'Updated title';

    const newConfigValues = {
      title: newTitle,
    };

    const response = await request(app)
      .patch('/api/v1/admin/config')
      .set('Authorization', token)
      .send(newConfigValues)
      .expect(200);

    expect(response.body.data.title).toEqual(newTitle);
    expect(response.body.meta.type).toEqual('Object');
  });

  it('should return null for deleted config entry', async () => {
    const newConfigValues = {
      title: null,
    };

    const response = await request(app)
      .patch('/api/v1/admin/config')
      .set('Authorization', token)
      .send(newConfigValues)
      .expect(200);

    expect(response.body.data.title).toBeNull();
    expect(response.body.meta.type).toEqual('Object');
  });
});
