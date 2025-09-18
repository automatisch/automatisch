import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import Crypto from 'crypto';

import app from '../../../../../app.js';
import createAuthTokenByUserId from '@/helpers/create-auth-token-by-user-id.js';
import { createUser } from '@/factories/user.js';
import { createPermission } from '@/factories/permission.js';
import { createMcpServer } from '@/factories/mcp-server.js';
import updateMcpServerMock from '@/mocks/rest/internal/api/v1/mcp-servers/update-mcp-server.js';

describe('PATCH /internal/api/v1/mcp-servers/:mcpServerId', () => {
  let currentUser, currentUserRole, token;

  beforeEach(async () => {
    currentUser = await createUser();
    currentUserRole = await currentUser.$relatedQuery('role');

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should update MCP server name successfully', async () => {
    const mcpServer = await createMcpServer({
      userId: currentUser.id,
      name: 'Original Name',
    });

    await createPermission({
      action: 'manage',
      subject: 'McpServer',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    const response = await request(app)
      .patch(`/internal/api/v1/mcp-servers/${mcpServer.id}`)
      .set('Authorization', token)
      .send({
        name: 'Updated Name',
      })
      .expect(200);

    const refetchedMcpServer = await currentUser
      .$relatedQuery('mcpServers')
      .findById(mcpServer.id);

    const expectedPayload = await updateMcpServerMock(refetchedMcpServer);

    expect(response.body).toMatchObject(expectedPayload);
  });

  it('should not update MCP server when no fields are provided', async () => {
    const mcpServer = await createMcpServer({
      userId: currentUser.id,
      name: 'Original Name',
    });

    await createPermission({
      action: 'manage',
      subject: 'McpServer',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    const response = await request(app)
      .patch(`/internal/api/v1/mcp-servers/${mcpServer.id}`)
      .set('Authorization', token)
      .send({})
      .expect(200);

    const refetchedMcpServer = await currentUser
      .$relatedQuery('mcpServers')
      .findById(mcpServer.id);

    const expectedPayload = await updateMcpServerMock(refetchedMcpServer);

    expect(response.body).toMatchObject(expectedPayload);
  });

  it("should return not found response when trying to update another user's MCP server", async () => {
    const anotherUser = await createUser();
    const anotherUserMcpServer = await createMcpServer({
      userId: anotherUser.id,
      name: 'Another User Server',
    });

    await createPermission({
      action: 'manage',
      subject: 'McpServer',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    await request(app)
      .patch(`/internal/api/v1/mcp-servers/${anotherUserMcpServer.id}`)
      .set('Authorization', token)
      .send({
        name: 'Updated Name',
      })
      .expect(404);
  });

  it('should return not found response for non-existing MCP server UUID', async () => {
    await createPermission({
      action: 'manage',
      subject: 'McpServer',
      roleId: currentUserRole.id,
      conditions: [],
    });

    const notExistingMcpServerUUID = Crypto.randomUUID();

    await request(app)
      .patch(`/internal/api/v1/mcp-servers/${notExistingMcpServerUUID}`)
      .set('Authorization', token)
      .send({
        name: 'Updated Name',
      })
      .expect(404);
  });

  it('should return bad request response for invalid MCP server UUID', async () => {
    await createPermission({
      action: 'manage',
      subject: 'McpServer',
      roleId: currentUserRole.id,
      conditions: [],
    });

    await request(app)
      .patch('/internal/api/v1/mcp-servers/invalidMcpServerUUID')
      .set('Authorization', token)
      .send({
        name: 'Updated Name',
      })
      .expect(400);
  });
});
