import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';

import app from '../../../../../app.js';
import createAuthTokenByUserId from '@/helpers/create-auth-token-by-user-id.js';
import { createUser } from '@/factories/user.js';
import { createPermission } from '@/factories/permission.js';
import { createMcpServer } from '@/factories/mcp-server.js';
import getMcpServersMock from '@/mocks/rest/internal/api/v1/mcp-servers/get-mcp-servers.js';

describe('GET /internal/api/v1/mcp-servers', () => {
  let currentUser, currentUserRole, token;

  beforeEach(async () => {
    currentUser = await createUser();
    currentUserRole = await currentUser.$relatedQuery('role');

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should return empty array when user has no MCP servers', async () => {
    await createPermission({
      action: 'read',
      subject: 'McpServer',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    const response = await request(app)
      .get('/internal/api/v1/mcp-servers')
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = await getMcpServersMock([]);

    expect(response.body).toStrictEqual(expectedPayload);
  });

  it("should return only current user's MCP servers", async () => {
    const userMcpServer = await createMcpServer({
      userId: currentUser.id,
      name: 'User MCP Server',
    });

    const anotherUser = await createUser();
    await createMcpServer({
      userId: anotherUser.id,
      name: 'Another User MCP Server',
    });

    await createPermission({
      action: 'read',
      subject: 'McpServer',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    const response = await request(app)
      .get('/internal/api/v1/mcp-servers')
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = await getMcpServersMock([userMcpServer]);

    expect(response.body).toStrictEqual(expectedPayload);
  });
});
