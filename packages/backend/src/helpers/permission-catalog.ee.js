const Connection = {
  label: 'Connection',
  key: 'Connection',
};

const Flow = {
  label: 'Flow',
  key: 'Flow',
};

const Execution = {
  label: 'Execution',
  key: 'Execution',
};

const McpServer = {
  label: 'MCP Server',
  key: 'McpServer',
};

const permissionCatalog = {
  conditions: [
    {
      key: 'isCreator',
      label: 'Is creator',
    },
  ],
  actions: [
    {
      label: 'Read',
      key: 'read',
      subjects: [Connection.key, Execution.key, Flow.key, McpServer.key],
    },
    {
      label: 'Manage',
      key: 'manage',
      subjects: [Connection.key, Flow.key, McpServer.key],
    },
  ],
  subjects: [Connection, Flow, Execution, McpServer],
};

export default permissionCatalog;
