import Base from './base.js';
import McpServer from './mcp-server.ee.js';
import logger from '@/helpers/logger.js';

class McpSession extends Base {
  static tableName = 'mcp_sessions';

  static #runtimeSessions = new Map();

  static jsonSchema = {
    type: 'object',
    required: ['mcpServerId'],

    properties: {
      id: { type: 'string', format: 'uuid' },
      mcpServerId: { type: 'string', format: 'uuid' },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
  };

  static relationMappings = () => ({
    mcpServer: {
      relation: Base.BelongsToOneRelation,
      modelClass: McpServer,
      join: {
        from: 'mcp_sessions.mcp_server_id',
        to: 'mcp_servers.id',
      },
    },
  });

  static async close(sessionId) {
    this.removeRuntime(sessionId);
    return await this.query().deleteById(sessionId);
  }

  static setRuntime(sessionId, { transport, server, serverId }) {
    this.#runtimeSessions.set(sessionId, { transport, server, serverId });
  }

  static getRuntime(sessionId) {
    return this.#runtimeSessions.get(sessionId);
  }

  static getRuntimeEntries() {
    return this.#runtimeSessions.entries();
  }

  static removeRuntime(sessionId) {
    this.#runtimeSessions.delete(sessionId);
  }

  static getTransport(sessionId) {
    return this.#runtimeSessions.get(sessionId)?.transport;
  }

  static getServer(sessionId) {
    return this.#runtimeSessions.get(sessionId)?.server;
  }

  static async terminateServerSessions(mcpServerId) {
    for (const [sessionId, entry] of this.#runtimeSessions.entries()) {
      if (entry.serverId === mcpServerId && entry.server) {
        try {
          await entry.server.close();
        } catch (error) {
          logger.error(
            `Error closing server for the session ${sessionId}:`,
            error
          );
        }

        this.removeRuntime(sessionId);
      }
    }
  }

  static async notifyToolsListChanged(mcpServerId) {
    for (const [sessionId, entry] of this.#runtimeSessions.entries()) {
      if (entry.serverId === mcpServerId && entry.server) {
        try {
          await entry.server.sendToolListChanged();
          logger.info(
            `Sent tool list changed notification to session ${sessionId} for server ${mcpServerId}`
          );
        } catch (error) {
          logger.error(
            `Error sending tool list changed notification to session ${sessionId}:`,
            error
          );
        }
      }
    }
  }
}

export default McpSession;
