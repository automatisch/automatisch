import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';

import app from '../../../../../app.js';
import createAuthTokenByUserId from '@/helpers/create-auth-token-by-user-id.js';
import { createUser } from '@/factories/user.js';
import { createPermission } from '@/factories/permission.js';
import createAgentMock from '@/mocks/rest/internal/api/v1/agents/create-agent.js';

describe('POST /internal/api/v1/agents', () => {
  let currentUser, currentUserRole, token;

  beforeEach(async () => {
    currentUser = await createUser();
    currentUserRole = await currentUser.$relatedQuery('role');
    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should create a new agent successfully', async () => {
    await createPermission({
      action: 'manage',
      subject: 'Agent',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    const response = await request(app)
      .post('/internal/api/v1/agents')
      .set('Authorization', token)
      .send({
        name: 'Test Agent',
        description: 'Test Description',
        instructions: 'Test Instructions',
      })
      .expect(201);

    const refetchedAgent = await currentUser
      .$relatedQuery('agents')
      .findById(response.body.data.id);

    const expectedPayload = await createAgentMock(refetchedAgent);

    expect(response.body).toMatchObject(expectedPayload);
  });

  it('should return unprocessable entity response for missing name and instructions', async () => {
    await createPermission({
      action: 'manage',
      subject: 'Agent',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    const response = await request(app)
      .post('/internal/api/v1/agents')
      .set('Authorization', token)
      .send({
        description: 'Test Description',
      })
      .expect(422);

    expect(response.body.errors).toStrictEqual({
      name: ["must have required property 'name'"],
    });
  });
});
