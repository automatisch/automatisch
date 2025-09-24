import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';

import app from '../../../../../app.js';
import createAuthTokenByUserId from '@/helpers/create-auth-token-by-user-id.js';
import { createUser } from '@/factories/user.js';
import { createPermission } from '@/factories/permission.js';
import createMcpServerMock from '@/mocks/rest/internal/api/v1/mcp-servers/create-mcp-server.js';

describe('POST /internal/api/v1/mcp-servers', () => {
  let currentUser, currentUserRole, token;

  beforeEach(async () => {
    currentUser = await createUser();
    currentUserRole = await currentUser.$relatedQuery('role');
    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should create a new MCP server successfully', async () => {
    await createPermission({
      action: 'manage',
      subject: 'McpServer',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    const response = await request(app)
      .post('/internal/api/v1/mcp-servers')
      .set('Authorization', token)
      .send({
        name: 'Test MCP Server',
      })
      .expect(201);

    const refetchedMcpServer = await currentUser
      .$relatedQuery('mcpServers')
      .findById(response.body.data.id);

    const expectedPayload = await createMcpServerMock(refetchedMcpServer);

    expect(response.body).toMatchObject(expectedPayload);
  });

  it('should return unprocessable entity response for missing name', async () => {
    await createPermission({
      action: 'manage',
      subject: 'McpServer',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    await request(app)
      .post('/internal/api/v1/mcp-servers')
      .set('Authorization', token)
      .send({})
      .expect(422);
  });

  it('should return different tokens for multiple servers', async () => {
    await createPermission({
      action: 'manage',
      subject: 'McpServer',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    const response1 = await request(app)
      .post('/internal/api/v1/mcp-servers')
      .set('Authorization', token)
      .send({
        name: 'First MCP Server',
      })
      .expect(201);

    const response2 = await request(app)
      .post('/internal/api/v1/mcp-servers')
      .set('Authorization', token)
      .send({
        name: 'Second MCP Server',
      })
      .expect(201);

    expect(response1.body.data.token).not.toBe(response2.body.data.token);
    expect(response1.body.data.serverUrl).not.toBe(
      response2.body.data.serverUrl
    );
  });
});
