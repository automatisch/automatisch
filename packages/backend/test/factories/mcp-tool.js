import { faker } from '@faker-js/faker';
import McpTool from '@/models/mcp-tool.ee.js';
import { createConnection } from '@/factories/connection.js';
import { createMcpServer } from '@/factories/mcp-server.js';

export const createMcpTool = async (params = {}) => {
  params.mcpServerId = params?.mcpServerId || (await createMcpServer()).id;
  params.type = params?.type || 'app';
  params.connectionId = params.connectionId || (await createConnection()).id;

  params.appKey =
    params?.appKey ||
    faker.helpers.arrayElement(['slack', 'github', 'airtable', 'anthropic']);

  params.action = params?.action || 'sendMessageToChannel';

  const mcpTool = await McpTool.query().insertAndFetch(params);

  return mcpTool;
};
