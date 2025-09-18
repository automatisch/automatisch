import { describe, it, expect, beforeEach } from 'vitest';
import { createMcpToolExecution } from '@/factories/mcp-tool-execution.js';
import mcpToolExecutionSerializer from '@/serializers/mcp-tool-execution.ee.js';

describe('mcpToolExecutionSerializer', () => {
  let mcpToolExecution;

  beforeEach(async () => {
    mcpToolExecution = await createMcpToolExecution();
  });

  it('should return MCP tool data', async () => {
    const expectedPayload = {
      id: mcpToolExecution.id,
      mcpToolId: mcpToolExecution.mcpToolId,
      status: mcpToolExecution.status,
      dataIn: mcpToolExecution.dataIn,
      dataOut: mcpToolExecution.dataOut,
      errorDetails: mcpToolExecution.errorDetails,
      createdAt: mcpToolExecution.createdAt.getTime(),
      updatedAt: mcpToolExecution.updatedAt.getTime(),
    };

    expect(mcpToolExecutionSerializer(mcpToolExecution)).toStrictEqual(
      expectedPayload
    );
  });
});
