import Crypto from 'node:crypto';
import McpSession from '@/models/mcp-session.ee.js';
import { createMcpServer } from './mcp-server.js';

export const createMcpSession = async (params = {}) => {
  params.id = params.id || Crypto.randomUUID();
  params.mcpServerId = params.mcpServerId || (await createMcpServer()).id;

  const mcpSession = await McpSession.query().insertAndFetch(params);

  return mcpSession;
};
