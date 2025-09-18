import { faker } from '@faker-js/faker';
import McpToolExecution from '@/models/mcp-tool-execution.ee.js';
import { createMcpTool } from '@/factories/mcp-tool.js';

export const createMcpToolExecution = async (params = {}) => {
  params.mcpToolId = params.mcpToolId || (await createMcpTool()).id;
  params.status =
    params.status || faker.helpers.arrayElement(['success', 'failure']);
  params.dataIn = params?.dataIn || { dataIn: 'dataIn' };
  params.dataOut = params?.dataOut || { dataOut: 'dataOut' };

  const mcpToolExecution = await McpToolExecution.query().insertAndFetch(
    params
  );

  return mcpToolExecution;
};
