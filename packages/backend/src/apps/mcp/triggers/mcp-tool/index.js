import defineTrigger from '../../../../helpers/define-trigger.js';
import isEmpty from 'lodash/isEmpty.js';

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

  async run($) {
    const lastExecutionStep = await $.getLastExecutionStep();

    if (!isEmpty(lastExecutionStep?.dataOut)) {
      $.pushTriggerItem({
        raw: lastExecutionStep.dataOut,
        meta: {
          internalId: '',
        },
      });
    }
  },
});
