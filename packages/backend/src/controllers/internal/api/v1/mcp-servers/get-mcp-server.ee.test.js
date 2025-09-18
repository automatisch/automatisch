import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import Crypto from 'crypto';

import app from '../../../../../app.js';
import createAuthTokenByUserId from '@/helpers/create-auth-token-by-user-id.js';
import { createUser } from '@/factories/user.js';
import { createPermission } from '@/factories/permission.js';
import getMcpServerMock from '@/mocks/rest/internal/api/v1/mcp-servers/get-mcp-server.js';

describe('GET /internal/api/v1/mcp-servers/:mcpServerId', () => {
  let currentUser, currentUserRole, token;

  beforeEach(async () => {
    currentUser = await createUser();
    currentUserRole = await currentUser.$relatedQuery('role');

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should return the MCP server data for current user', async () => {
    const mcpServer = await currentUser
      .$relatedQuery('mcpServers')
      .insertAndFetch({
        name: 'Test MCP Server',
      });

    await createPermission({
      action: 'read',
      subject: 'McpServer',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    const response = await request(app)
      .get(`/internal/api/v1/mcp-servers/${mcpServer.id}`)
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = await getMcpServerMock(mcpServer);

    expect(response.body).toStrictEqual(expectedPayload);
  });

  it("should return not found response when trying to access another user's MCP server", async () => {
    const anotherUser = await createUser();
    const anotherUserMcpServer = await anotherUser
      .$relatedQuery('mcpServers')
      .insertAndFetch({
        name: 'Another User MCP Server',
      });

    await createPermission({
      action: 'read',
      subject: 'McpServer',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    await request(app)
      .get(`/internal/api/v1/mcp-servers/${anotherUserMcpServer.id}`)
      .set('Authorization', token)
      .expect(404);
  });

  it('should return not found response for non-existing MCP server UUID', async () => {
    await createPermission({
      action: 'read',
      subject: 'McpServer',
      roleId: currentUserRole.id,
      conditions: [],
    });

    const notExistingMcpServerUUID = Crypto.randomUUID();

    await request(app)
      .get(`/internal/api/v1/mcp-servers/${notExistingMcpServerUUID}`)
      .set('Authorization', token)
      .expect(404);
  });

  it('should return bad request response for invalid MCP server UUID', async () => {
    await createPermission({
      action: 'read',
      subject: 'McpServer',
      roleId: currentUserRole.id,
      conditions: [],
    });

    await request(app)
      .get('/internal/api/v1/mcp-servers/invalidMcpServerUUID')
      .set('Authorization', token)
      .expect(400);
  });
});
