import Base from '@/models/base.js';
import McpTool from '@/models/mcp-tool.ee.js';

class McpToolExecution extends Base {
  static tableName = 'mcp_tool_executions';

  static jsonSchema = {
    type: 'object',

    properties: {
      id: { type: 'string', format: 'uuid' },
      mcpToolId: { type: 'string', format: 'uuid' },
      dataIn: { type: ['object', 'null'] },
      dataOut: { type: ['object', 'null'] },
      errorDetails: { type: ['object', 'null'] },
      status: { type: 'string', enum: ['success', 'failure'] },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
  };

  static relationMappings = () => ({
    mcpTool: {
      relation: Base.BelongsToOneRelation,
      modelClass: McpTool,
      join: {
        from: 'mcp_tool_executions.mcp_tool_id',
        to: 'mcp_tools.id',
      },
    },
  });
}

export default McpToolExecution;
