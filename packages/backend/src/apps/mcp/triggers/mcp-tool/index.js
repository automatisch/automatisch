import Crypto from 'crypto';
import defineTrigger from '../../../../helpers/define-trigger.js';

export default defineTrigger({
  name: 'MCP Tool',
  key: 'mcpTool',
  description:
    'Defines an MCP tool that can be called by external MCP clients with configurable input schema.',
  arguments: [
    {
      label: 'Tool Name',
      key: 'toolName',
      type: 'string',
      required: true,
      description:
        'The name of the MCP tool (e.g., "search_files", "create_task")',
      variables: true,
    },
    {
      label: 'Tool Description',
      key: 'toolDescription',
      type: 'string',
      required: true,
      description: 'A clear description of what this tool does',
      variables: true,
    },
    {
      label: 'Input Schema (JSON)',
      key: 'inputSchema',
      type: 'string',
      required: false,
      description:
        "JSON Schema defining the tool's input parameters (optional)",
      variables: true,
    },
  ],

  async run() {
    // This trigger doesn't poll - it's exposed via MCP service
    // The actual trigger execution happens when MCP clients call the tool
  },

  async testRun($) {
    const { toolName, toolDescription, inputSchema } = $.step.parameters;

    let sampleSchema = {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query',
        },
      },
      required: ['query'],
    };

    if (inputSchema) {
      try {
        sampleSchema = JSON.parse(inputSchema);
      } catch (error) {
        // Use default schema if parsing fails
      }
    }

    const sampleData = {
      toolName: toolName || 'sample_tool',
      toolDescription:
        toolDescription || 'This is a sample MCP tool for testing',
      inputSchema: sampleSchema,
      request: {
        headers: {
          'content-type': 'application/json',
          'user-agent': 'MCP-Client/1.0',
        },
        body: {
          method: 'tools/call',
          params: {
            name: toolName || 'sample_tool',
            arguments: sampleSchema.properties
              ? Object.keys(sampleSchema.properties).reduce((acc, key) => {
                  acc[key] = `sample_${key}`;
                  return acc;
                }, {})
              : {},
          },
        },
        query: {},
      },
    };

    $.pushTriggerItem({
      raw: sampleData,
      meta: {
        internalId: Crypto.randomUUID(),
      },
    });
  },
});
