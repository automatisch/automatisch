import { faker } from '@faker-js/faker';
import Crypto from 'node:crypto';
import McpTool from '@/models/mcp-tool.ee.js';
import { createConnection } from '@/factories/connection.js';

export const createMcpTool = async (params = {}) => {
  params.serverId = params?.serverId || Crypto.randomUUID();
  params.type = params?.type || 'app';
  params.connectionId = params.connectionId || (await createConnection()).id;

  params.appKey =
    params?.appKey ||
    faker.helpers.arrayElement(['slack', 'github', 'airtable', 'anthropic']);

  params.actions =
    params?.actions ||
    faker.helpers.arrayElements(
      ['sendMessageToChannel', 'createTask', 'findUserByEmail'],
      { min: 1, max: 3 }
    );

  const mcpTool = await McpTool.query().insertAndFetch(params);

  return mcpTool;
};
