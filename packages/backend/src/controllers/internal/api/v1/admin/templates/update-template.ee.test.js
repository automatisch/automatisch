import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import Crypto from 'crypto';
import app from '../../../../../../app.js';
import createAuthTokenByUserId from '../../../../../../helpers/create-auth-token-by-user-id.js';
import { createRole } from '../../../../../../../test/factories/role.js';
import { createUser } from '../../../../../../../test/factories/user.js';
import { createTemplate } from '../../../../../../../test/factories/template.js';
import updateTemplateMock from '../../../../../../../test/mocks/rest/internal/api/v1/admin/templates/update-template.ee.js';
import * as license from '../../../../../../helpers/license.ee.js';

describe('PATCH /internal/api/v1/admin/templates/:templateId', () => {
  let currentUser, token, role;

  beforeEach(async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    role = await createRole({ name: 'Admin' });
    currentUser = await createUser({ roleId: role.id });

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should return the updated template', async () => {
    const template = await createTemplate();
    const updatedName = 'Updated Template Name';

    const response = await request(app)
      .patch(`/internal/api/v1/admin/templates/${template.id}`)
      .set('Authorization', token)
      .send({ name: updatedName })
      .expect(200);

    const refetchedTemplate = await template.$query();

    const expectedPayload = await updateTemplateMock({
      ...refetchedTemplate,
      flowData: refetchedTemplate.getFlowDataWithIconUrls(),
      name: updatedName,
    });

    expect(response.body).toStrictEqual(expectedPayload);
  });

  it('should return unprocessable entity response for invalid name', async () => {
    const template = await createTemplate();

    const response = await request(app)
      .patch(`/internal/api/v1/admin/templates/${template.id}`)
      .set('Authorization', token)
      .send({ name: '' })
      .expect(422);

    expect(response.body).toStrictEqual({
      errors: {
        name: ['must NOT have fewer than 1 characters'],
      },
      meta: { type: 'ModelValidation' },
    });
  });

  it('should return not found response for not existing template UUID', async () => {
    const notExistingTemplateUUID = Crypto.randomUUID();

    await request(app)
      .patch(`/internal/api/v1/admin/templates/${notExistingTemplateUUID}`)
      .set('Authorization', token)
      .expect(404);
  });

  it('should return bad request response for invalid UUID', async () => {
    await request(app)
      .patch('/internal/api/v1/admin/templates/invalidTemplateUUID')
      .set('Authorization', token)
      .expect(400);
  });
});
