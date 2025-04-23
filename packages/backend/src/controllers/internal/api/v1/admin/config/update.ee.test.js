import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';

import app from '../../../../../../app.js';
import createAuthTokenByUserId from '../../../../../../helpers/create-auth-token-by-user-id.js';
import { createUser } from '../../../../../../../test/factories/user.js';
import { createRole } from '../../../../../../../test/factories/role.js';
import { updateConfig } from '../../../../../../../test/factories/config.js';
import * as license from '../../../../../../helpers/license.ee.js';

describe('PATCH /internal/api/v1/admin/config', () => {
  let currentUser, adminRole, token;

  beforeEach(async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    adminRole = await createRole({ name: 'Admin' });
    currentUser = await createUser({ roleId: adminRole.id });

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should return updated config', async () => {
    const title = 'Test environment - Automatisch';
    const palettePrimaryMain = '#00adef';
    const palettePrimaryDark = '#222222';
    const palettePrimaryLight = '#f90707';
    const enableFooter = true;
    const footerCopyrightText = '© AB Software GmbH';
    const footerBackgroundColor = '#FFFFFF';
    const footerTextColor = '#000000';
    const footerDocsUrl = 'https://automatisch.io/docs';
    const footerTosUrl = 'https://automatisch.io/terms';
    const footerPrivacyPolicyUrl = 'https://automatisch.io/privacy';
    const footerImprintUrl = 'https://automatisch.io/imprint';

    const footerLogoSvgData =
      '<svg width="25" height="25" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="white" /><text x="10" y="40" font-family="Arial" font-size="40" fill="black">Sample Footer Logo</text></svg>';

    const logoSvgData =
      '<svg width="25" height="25" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="white" /><text x="10" y="40" font-family="Arial" font-size="40" fill="black">A</text></svg>';

    const appConfig = {
      title,
      palettePrimaryMain: palettePrimaryMain,
      palettePrimaryDark: palettePrimaryDark,
      palettePrimaryLight: palettePrimaryLight,
      logoSvgData: logoSvgData,
      enableFooter,
      footerCopyrightText,
      footerBackgroundColor,
      footerTextColor,
      footerDocsUrl,
      footerTosUrl,
      footerPrivacyPolicyUrl,
      footerImprintUrl,
      footerLogoSvgData,
    };

    await updateConfig(appConfig);

    const newTitle = 'Updated title';

    const newConfigValues = {
      title: newTitle,
    };

    const response = await request(app)
      .patch('/internal/api/v1/admin/config')
      .set('Authorization', token)
      .send(newConfigValues)
      .expect(200);

    expect(response.body.data.title).toStrictEqual(newTitle);
    expect(response.body.meta.type).toStrictEqual('Config');
  });

  it('should return created config for unexisting config', async () => {
    const newTitle = 'Updated title';

    const newConfigValues = {
      title: newTitle,
    };

    const response = await request(app)
      .patch('/internal/api/v1/admin/config')
      .set('Authorization', token)
      .send(newConfigValues)
      .expect(200);

    expect(response.body.data.title).toStrictEqual(newTitle);
    expect(response.body.meta.type).toStrictEqual('Config');
  });

  it('should return null for deleted config entry', async () => {
    const newConfigValues = {
      title: null,
    };

    const response = await request(app)
      .patch('/internal/api/v1/admin/config')
      .set('Authorization', token)
      .send(newConfigValues)
      .expect(200);

    expect(response.body.data.title).toBeNull();
    expect(response.body.meta.type).toStrictEqual('Config');
  });
});
