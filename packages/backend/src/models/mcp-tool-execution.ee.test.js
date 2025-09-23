import { describe, it, expect } from 'vitest';
import McpTool from '@/models/mcp-tool.ee.js';
import McpToolExecution from '@/models/mcp-tool-execution.ee.js';
import Base from '@/models/base.js';

describe('McpToolExecution model', () => {
  it('tableName should return correct name', () => {
    expect(McpToolExecution.tableName).toBe('mcp_tool_executions');
  });

  it('jsonSchema should have correct validations', () => {
    expect(McpToolExecution.jsonSchema).toMatchSnapshot();
  });

  it('relationMappings should return correct associations', () => {
    const relationMappings = McpToolExecution.relationMappings();

    const expectedRelations = {
      mcpTool: {
        relation: Base.BelongsToOneRelation,
        modelClass: McpTool,
        join: {
          from: 'mcp_tool_executions.mcp_tool_id',
          to: 'mcp_tools.id',
        },
      },
    };

    expect(relationMappings).toStrictEqual(expectedRelations);
  });
});
