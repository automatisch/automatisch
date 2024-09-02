import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';

import app from '../../../../app.js';
import createAuthTokenByUserId from '../../../../helpers/create-auth-token-by-user-id.js';
import { createUser } from '../../../../../test/factories/user.js';
import createFlowMock from '../../../../../test/mocks/rest/api/v1/flows/create-flow.js';
import { createPermission } from '../../../../../test/factories/permission.js';

describe('POST /api/v1/flows', () => {
  let currentUser, currentUserRole, token;

  beforeEach(async () => {
    currentUser = await createUser();
    currentUserRole = await currentUser.$relatedQuery('role');

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should return created flow', async () => {
    await createPermission({
      action: 'create',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    const response = await request(app)
      .post('/api/v1/flows')
      .set('Authorization', token)
      .expect(201);

    const refetchedFlow = await currentUser
      .$relatedQuery('flows')
      .findById(response.body.data.id);

    const expectedPayload = await createFlowMock(refetchedFlow);

    expect(response.body).toMatchObject(expectedPayload);
  });
});
