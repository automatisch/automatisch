import { faker } from '@faker-js/faker';
import McpServer from '@/models/mcp-server.ee.js';
import { createUser } from '@/factories/user.js';

export const createMcpServer = async (params = {}) => {
  params.userId = params.userId || (await createUser()).id;
  params.name = params.name || faker.company.name();

  const mcpServer = await McpServer.query().insertAndFetch(params);

  return mcpServer;
};
