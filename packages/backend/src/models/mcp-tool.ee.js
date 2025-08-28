import Base from '@/models/base.js';
import McpServer from '@/models/mcp-server.ee.js';

class McpTool extends Base {
  static tableName = 'mcp_tools';

  static jsonSchema = {
    type: 'object',

    properties: {
      id: { type: 'string', format: 'uuid' },
      serverId: { type: 'string', format: 'uuid' },
      type: {
        type: 'string',
        enum: ['flow', 'app'],
        default: 'app',
      },
      flowId: { type: 'string', format: 'uuid' },
      connectionId: { type: 'string', format: 'uuid' },
      appKey: { type: 'string' },
      actions: { type: 'array' },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
  };

  static relationMappings = () => ({
    server: {
      relation: Base.BelongsToOneRelation,
      modelClass: McpServer,
      join: {
        from: 'mcp_servers.id',
        to: 'mcp_tools.server_id',
      },
    },
  });
}

export default McpTool;
