import { describe, it, expect } from 'vitest';

import Base from '@/models/base.js';
import McpServer from '@/models/mcp-server.ee.js';
import McpTool from '@/models/mcp-tool.ee.js';
import McpToolExecutions from '@/models/mcp-tool-execution.ee.js';

describe('McpTool model', () => {
  it('tableName should return correct name', () => {
    expect(McpTool.tableName).toBe('mcp_tools');
  });

  it('jsonSchema should have correct validations', () => {
    expect(McpTool.jsonSchema).toMatchSnapshot();
  });

  it('relationMappings should return correct associations', () => {
    const relationMappings = McpTool.relationMappings();

    const expectedRelations = {
      mcpServer: {
        relation: Base.BelongsToOneRelation,
        modelClass: McpServer,
        join: {
          from: 'mcp_servers.id',
          to: 'mcp_tools.mcp_server_id',
        },
      },
      mcpToolExecutions: {
        relation: Base.HasManyRelation,
        modelClass: McpToolExecutions,
        join: {
          from: 'mcp_tools.id',
          to: 'mcp_tool_executions.mcp_tool_id',
        },
      },
    };

    expect(relationMappings).toStrictEqual(expectedRelations);
  });
});
