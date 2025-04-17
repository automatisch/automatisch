import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';

import app from '../../../../../app.js';
import createAuthTokenByUserId from '../../../../../helpers/create-auth-token-by-user-id.js';
import { createUser } from '../../../../../../test/factories/user.js';
import { createTemplate } from '../../../../../../test/factories/template.js';
import createFlowMock from '../../../../../../test/mocks/rest/internal/api/v1/flows/create-flow.js';
import { createPermission } from '../../../../../../test/factories/permission.js';

describe('POST /internal/api/v1/flows', () => {
  let currentUser, currentUserRole, token;

  beforeEach(async () => {
    currentUser = await createUser();
    currentUserRole = await currentUser.$relatedQuery('role');

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should create an empty flow when no templateId is provided', async () => {
    await createPermission({
      action: 'manage',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    const response = await request(app)
      .post('/internal/api/v1/flows')
      .set('Authorization', token)
      .expect(201);

    const refetchedFlow = await currentUser
      .$relatedQuery('flows')
      .findById(response.body.data.id);

    const expectedPayload = await createFlowMock(refetchedFlow);

    expect(response.body).toMatchObject(expectedPayload);
  });

  it('should create a flow from template when templateId is provided', async () => {
    await createPermission({
      action: 'manage',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    const template = await createTemplate({
      name: 'Sample template',
    });

    const response = await request(app)
      .post('/internal/api/v1/flows')
      .query({ templateId: template.id })
      .set('Authorization', token)
      .expect(201);

    expect(response.body.data.name).toBe(template.flowData.name);
  });
});
