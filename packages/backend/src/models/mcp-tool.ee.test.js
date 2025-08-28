import { describe, it, expect } from 'vitest';

import Base from '@/models/base.js';
import McpServer from '@/models/mcp-server.ee.js';
import McpTool from '@/models/mcp-tool.ee.js';

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
      server: {
        relation: Base.BelongsToOneRelation,
        modelClass: McpServer,
        join: {
          from: 'mcp_servers.id',
          to: 'mcp_tools.server_id',
        },
      },
    };

    expect(relationMappings).toStrictEqual(expectedRelations);
  });
});