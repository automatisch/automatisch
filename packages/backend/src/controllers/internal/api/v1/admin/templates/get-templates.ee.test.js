import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../../../../../app.js';
import createAuthTokenByUserId from '../../../../../../helpers/create-auth-token-by-user-id.js';
import { createRole } from '../../../../../../../test/factories/role.js';
import { createUser } from '../../../../../../../test/factories/user.js';
import { createTemplate } from '../../../../../../../test/factories/template.js';
import getTemplatesMock from '../../../../../../../test/mocks/rest/internal/api/v1/admin/templates/get-templates.ee.js';
import * as license from '../../../../../../helpers/license.ee.js';

describe('GET /internal/api/v1/admin/templates', () => {
  let currentUser, token, role;

  beforeEach(async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    role = await createRole({ name: 'Admin' });
    currentUser = await createUser({ roleId: role.id });

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should return templates', async () => {
    const templateOne = await createTemplate();
    const templateTwo = await createTemplate();

    const response = await request(app)
      .get('/internal/api/v1/admin/templates')
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = await getTemplatesMock([templateOne, templateTwo]);

    expect(response.body).toStrictEqual(expectedPayload);
  });
});
