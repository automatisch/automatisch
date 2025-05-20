import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../../../../app.js';
import createAuthTokenByUserId from '../../../../../helpers/create-auth-token-by-user-id.js';
import { createUser } from '../../../../../../test/factories/user.js';
import { createTemplate } from '../../../../../../test/factories/template.js';
import { updateConfig } from '../../../../../../test/factories/config.js';
import { createPermission } from '../../../../../../test/factories/permission.js';
import getTemplatesMock from '../../../../../../test/mocks/rest/internal/api/v1/templates/get-templates.ee.js';
import * as license from '../../../../../helpers/license.ee.js';

describe('GET /internal/api/v1/templates', () => {
  let currentUser, currentUserRole, token;

  beforeEach(async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    currentUser = await createUser();
    currentUserRole = await currentUser.$relatedQuery('role');
    token = await createAuthTokenByUserId(currentUser.id);

    await updateConfig({ enableTemplates: true });
  });

  it('should return templates when templates are enabled and user has create flow permission', async () => {
    await createPermission({
      action: 'manage',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: [],
    });

    const templateOne = await createTemplate();
    const templateTwo = await createTemplate();

    const response = await request(app)
      .get('/internal/api/v1/templates')
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = await getTemplatesMock([templateOne, templateTwo]);

    expect(response.body).toStrictEqual(expectedPayload);
  });

  it('should return 403 when templates are disabled', async () => {
    await createPermission({
      action: 'manage',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: [],
    });

    await updateConfig({ enableTemplates: false });

    await request(app)
      .get('/internal/api/v1/templates')
      .set('Authorization', token)
      .expect(403);
  });

  it('should return 403 when user does not have create flow permission', async () => {
    await request(app)
      .get('/internal/api/v1/templates')
      .set('Authorization', token)
      .expect(403);
  });
});
