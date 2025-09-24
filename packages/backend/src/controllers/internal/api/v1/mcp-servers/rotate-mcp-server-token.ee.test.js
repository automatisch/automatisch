import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import Crypto from 'crypto';

import app from '../../../../../app.js';
import createAuthTokenByUserId from '@/helpers/create-auth-token-by-user-id.js';
import { createUser } from '@/factories/user.js';
import { createPermission } from '@/factories/permission.js';
import { createMcpServer } from '@/factories/mcp-server.js';
import rotateMcpServerTokenMock from '@/mocks/rest/internal/api/v1/mcp-servers/rotate-mcp-server-token.js';

describe('POST /internal/api/v1/mcp-servers/:mcpServerId/rotate-token', () => {
  let currentUser, currentUserRole, token;

  beforeEach(async () => {
    currentUser = await createUser();
    currentUserRole = await currentUser.$relatedQuery('role');

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should rotate MCP server token successfully', async () => {
    const mcpServer = await createMcpServer({
      userId: currentUser.id,
      name: 'Test MCP Server',
    });

    const originalToken = mcpServer.token;

    await createPermission({
      action: 'manage',
      subject: 'McpServer',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    const response = await request(app)
      .post(`/internal/api/v1/mcp-servers/${mcpServer.id}/rotate-token`)
      .set('Authorization', token)
      .expect(200);

    const refetchedMcpServer = await currentUser
      .$relatedQuery('mcpServers')
      .findById(mcpServer.id);

    expect(refetchedMcpServer.token).not.toBe(originalToken);

    const expectedPayload = await rotateMcpServerTokenMock(refetchedMcpServer);

    expect(response.body).toMatchObject(expectedPayload);
  });

  it("should return not found response when trying to rotate another user's MCP server token", async () => {
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
      .post(
        `/internal/api/v1/mcp-servers/${anotherUserMcpServer.id}/rotate-token`
      )
      .set('Authorization', token)
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
      .post(
        `/internal/api/v1/mcp-servers/${notExistingMcpServerUUID}/rotate-token`
      )
      .set('Authorization', token)
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
      .post('/internal/api/v1/mcp-servers/invalidMcpServerUUID/rotate-token')
      .set('Authorization', token)
      .expect(400);
  });
});
