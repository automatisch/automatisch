import logger from '@/helpers/logger.js';

const sessions = new Map();

const mcpSessionManager = {
  add(sessionId, serverId, transport, server) {
    sessions.set(sessionId, { serverId, transport, server });
  },

  get(sessionId) {
    return sessions.get(sessionId);
  },

  remove(sessionId) {
    sessions.delete(sessionId);
  },

  getServerId(sessionId) {
    return sessions.get(sessionId)?.serverId;
  },

  getTransport(sessionId) {
    return sessions.get(sessionId)?.transport;
  },

  getServer(sessionId) {
    return sessions.get(sessionId)?.server;
  },

  async terminateServerSessions(serverId) {
    for (const [, entry] of sessions.entries()) {
      if (entry.serverId === serverId && entry.server) {
        try {
          await entry.server.close();
        } catch (error) {
          // Silently handle termination errors
        }
      }
    }
  },

  async notifyToolsListChanged(serverId) {
    for (const [sessionId, entry] of sessions.entries()) {
      if (entry.serverId === serverId && entry.server) {
        try {
          await entry.server.sendToolListChanged();
          logger.info(
            `Sent tool list changed notification to session ${sessionId} for server ${serverId}`
          );
        } catch (error) {
          logger.error(
            `Error sending tool list changed notification to session ${sessionId}:`,
            error
          );
        }
      }
    }
  },
};

export default mcpSessionManager;
