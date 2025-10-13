import NotAuthorizedError from '@/errors/not-authorized.js';

const authorizationList = {
  'GET /internal/api/v1/users/:userId': {
    action: 'read',
    subject: 'User',
  },
  'GET /internal/api/v1/users/': {
    action: 'read',
    subject: 'User',
  },
  'GET /internal/api/v1/users/:userId/apps': {
    action: 'read',
    subject: 'Connection',
  },
  'GET /internal/api/v1/flows/:flowId': {
    action: 'read',
    subject: 'Flow',
  },
  'GET /internal/api/v1/flows/': {
    action: 'read',
    subject: 'Flow',
  },
  'POST /internal/api/v1/flows/': {
    action: 'manage',
    subject: 'Flow',
  },
  'PATCH /internal/api/v1/flows/:flowId': {
    action: 'manage',
    subject: 'Flow',
  },
  'DELETE /internal/api/v1/flows/:flowId': {
    action: 'manage',
    subject: 'Flow',
  },
  'GET /internal/api/v1/templates/': {
    action: 'manage',
    subject: 'Flow',
  },
  'GET /internal/api/v1/steps/:stepId/connection': {
    action: 'read',
    subject: 'Flow',
  },
  'PATCH /internal/api/v1/steps/:stepId': {
    action: 'manage',
    subject: 'Flow',
  },
  'POST /internal/api/v1/steps/:stepId/test-and-continue': {
    action: 'manage',
    subject: 'Flow',
  },
  'POST /internal/api/v1/steps/:stepId/continue-without-test': {
    action: 'manage',
    subject: 'Flow',
  },
  'GET /internal/api/v1/steps/:stepId/previous-steps': {
    action: 'manage',
    subject: 'Flow',
  },
  'POST /internal/api/v1/steps/:stepId/dynamic-fields': {
    action: 'manage',
    subject: 'Flow',
  },
  'POST /internal/api/v1/steps/:stepId/dynamic-data': {
    action: 'manage',
    subject: 'Flow',
  },
  'GET /internal/api/v1/connections/:connectionId/flows': {
    action: 'read',
    subject: 'Flow',
  },
  'POST /internal/api/v1/connections/:connectionId/test': {
    action: 'manage',
    subject: 'Connection',
  },
  'POST /internal/api/v1/connections/:connectionId/verify': {
    action: 'manage',
    subject: 'Connection',
  },
  'GET /internal/api/v1/apps/:appKey/flows': {
    action: 'read',
    subject: 'Flow',
  },
  'GET /internal/api/v1/apps/:appKey/connections': {
    action: 'read',
    subject: 'Connection',
  },
  'GET /internal/api/v1/executions/:executionId': {
    action: 'read',
    subject: 'Execution',
  },
  'GET /internal/api/v1/executions/': {
    action: 'read',
    subject: 'Execution',
  },
  'GET /internal/api/v1/executions/:executionId/execution-steps': {
    action: 'read',
    subject: 'Execution',
  },
  'DELETE /internal/api/v1/steps/:stepId': {
    action: 'manage',
    subject: 'Flow',
  },
  'PATCH /internal/api/v1/connections/:connectionId': {
    action: 'manage',
    subject: 'Connection',
  },
  'DELETE /internal/api/v1/connections/:connectionId': {
    action: 'manage',
    subject: 'Connection',
  },
  'POST /internal/api/v1/connections/:connectionId/reset': {
    action: 'manage',
    subject: 'Connection',
  },
  'PATCH /internal/api/v1/flows/:flowId/status': {
    action: 'manage',
    subject: 'Flow',
  },
  'POST /internal/api/v1/flows/:flowId/duplicate': {
    action: 'manage',
    subject: 'Flow',
  },
  'POST /internal/api/v1/flows/:flowId/export': {
    action: 'manage',
    subject: 'Flow',
  },
  'POST /internal/api/v1/flows/import': {
    action: 'manage',
    subject: 'Flow',
  },
  'POST /internal/api/v1/flows/:flowId/steps': {
    action: 'manage',
    subject: 'Flow',
  },
  'POST /internal/api/v1/apps/:appKey/connections': {
    action: 'manage',
    subject: 'Connection',
  },
  'POST /internal/api/v1/connections/:connectionId/auth-url': {
    action: 'manage',
    subject: 'Connection',
  },
  'POST /internal/api/v1/folders/': {
    action: 'manage',
    subject: 'Flow',
  },
  'PATCH /internal/api/v1/folders/:folderId': {
    action: 'manage',
    subject: 'Flow',
  },
  'DELETE /internal/api/v1/folders/:folderId': {
    action: 'manage',
    subject: 'Flow',
  },
  'GET /internal/api/v1/folders/': {
    action: 'read',
    subject: 'Flow',
  },
  'PATCH /internal/api/v1/flows/:flowId/folder': {
    action: 'manage',
    subject: 'Flow',
  },
  'GET /internal/api/v1/flows/:flowId/folder': {
    action: 'read',
    subject: 'Flow',
  },
  'GET /internal/api/v1/forms/:formId': {
    action: 'read',
    subject: 'Flow',
  },
  'GET /internal/api/v1/forms/': {
    action: 'read',
    subject: 'Flow',
  },
  'POST /internal/api/v1/forms/': {
    action: 'manage',
    subject: 'Flow',
  },
  'PATCH /internal/api/v1/forms/:formId': {
    action: 'manage',
    subject: 'Flow',
  },
  'DELETE /internal/api/v1/forms/:formId': {
    action: 'manage',
    subject: 'Flow',
  },
  'GET /internal/api/v1/mcp-servers/': {
    action: 'read',
    subject: 'McpServer',
  },
  'POST /internal/api/v1/mcp-servers/': {
    action: 'manage',
    subject: 'McpServer',
  },
  'GET /internal/api/v1/mcp-servers/:mcpServerId': {
    action: 'read',
    subject: 'McpServer',
  },
  'PATCH /internal/api/v1/mcp-servers/:mcpServerId': {
    action: 'manage',
    subject: 'McpServer',
  },
  'DELETE /internal/api/v1/mcp-servers/:mcpServerId': {
    action: 'manage',
    subject: 'McpServer',
  },
  'GET /internal/api/v1/mcp-servers/:mcpServerId/executions': {
    action: 'read',
    subject: 'McpServer',
  },
  'GET /internal/api/v1/mcp-servers/:mcpServerId/tools': {
    action: 'read',
    subject: 'McpServer',
  },
  'POST /internal/api/v1/mcp-servers/:mcpServerId/tools': {
    action: 'manage',
    subject: 'McpServer',
  },
  'DELETE /internal/api/v1/mcp-servers/:mcpServerId/tools/:mcpToolId': {
    action: 'manage',
    subject: 'McpServer',
  },
  'POST /internal/api/v1/mcp-servers/:mcpServerId/rotate-token': {
    action: 'manage',
    subject: 'McpServer',
  },
  'POST /internal/api/v1/agents/': {
    action: 'manage',
    subject: 'Agent',
  },
  'GET /internal/api/v1/agents/:agentId': {
    action: 'read',
    subject: 'Agent',
  },
  'DELETE /internal/api/v1/agents/:agentId': {
    action: 'manage',
    subject: 'Agent',
  },
  'PATCH /internal/api/v1/agents/:agentId': {
    action: 'manage',
    subject: 'Agent',
  },
  'GET /internal/api/v1/agents/': {
    action: 'read',
    subject: 'Agent',
  },
  'POST /internal/api/v1/agents/:agentId/test': {
    action: 'manage',
    subject: 'Agent',
  },
  'GET /internal/api/v1/agents/:agentId/executions': {
    action: 'read',
    subject: 'Agent',
  },
  'GET /internal/api/v1/agents/:agentId/executions/:executionId': {
    action: 'read',
    subject: 'Agent',
  },
  'GET /internal/api/v1/agents/:agentId/tools': {
    action: 'read',
    subject: 'Agent',
  },
  'POST /internal/api/v1/agents/:agentId/tools': {
    action: 'manage',
    subject: 'Agent',
  },
  'DELETE /internal/api/v1/agents/:agentId/tools/:toolId': {
    action: 'manage',
    subject: 'Agent',
  },
};

export const authorizeUser = async (request, response, next) => {
  const currentRoute =
    request.method + ' ' + request.baseUrl + request.route.path;
  const currentRouteRule = authorizationList[currentRoute];

  request.currentUser.can(currentRouteRule.action, currentRouteRule.subject);
  next();
};

export const authorizeAdmin = async (request, response, next) => {
  const role = await request.currentUser.$relatedQuery('role');

  if (role?.isAdmin) {
    next();
  } else {
    throw new NotAuthorizedError();
  }
};
