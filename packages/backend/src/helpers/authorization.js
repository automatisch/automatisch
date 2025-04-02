import NotAuthorizedError from '../errors/not-authorized.js';

const authorizationList = {
  'GET /api/v1/users/:userId': {
    action: 'read',
    subject: 'User',
  },
  'GET /api/v1/users/': {
    action: 'read',
    subject: 'User',
  },
  'GET /api/v1/users/:userId/apps': {
    action: 'read',
    subject: 'Connection',
  },
  'GET /api/v1/flows/:flowId': {
    action: 'read',
    subject: 'Flow',
  },
  'GET /api/v1/flows/': {
    action: 'read',
    subject: 'Flow',
  },
  'POST /api/v1/flows/': {
    action: 'manage',
    subject: 'Flow',
  },
  'PATCH /api/v1/flows/:flowId': {
    action: 'manage',
    subject: 'Flow',
  },
  'DELETE /api/v1/flows/:flowId': {
    action: 'manage',
    subject: 'Flow',
  },
  'GET /api/v1/templates/': {
    action: 'manage',
    subject: 'Flow',
  },
  'GET /api/v1/steps/:stepId/connection': {
    action: 'read',
    subject: 'Flow',
  },
  'PATCH /api/v1/steps/:stepId': {
    action: 'manage',
    subject: 'Flow',
  },
  'POST /api/v1/steps/:stepId/test': {
    action: 'manage',
    subject: 'Flow',
  },
  'GET /api/v1/steps/:stepId/previous-steps': {
    action: 'manage',
    subject: 'Flow',
  },
  'POST /api/v1/steps/:stepId/dynamic-fields': {
    action: 'manage',
    subject: 'Flow',
  },
  'POST /api/v1/steps/:stepId/dynamic-data': {
    action: 'manage',
    subject: 'Flow',
  },
  'GET /api/v1/connections/:connectionId/flows': {
    action: 'read',
    subject: 'Flow',
  },
  'POST /api/v1/connections/:connectionId/test': {
    action: 'manage',
    subject: 'Connection',
  },
  'POST /api/v1/connections/:connectionId/verify': {
    action: 'manage',
    subject: 'Connection',
  },
  'GET /api/v1/apps/:appKey/flows': {
    action: 'read',
    subject: 'Flow',
  },
  'GET /api/v1/apps/:appKey/connections': {
    action: 'read',
    subject: 'Connection',
  },
  'GET /api/v1/executions/:executionId': {
    action: 'read',
    subject: 'Execution',
  },
  'GET /api/v1/executions/': {
    action: 'read',
    subject: 'Execution',
  },
  'GET /api/v1/executions/:executionId/execution-steps': {
    action: 'read',
    subject: 'Execution',
  },
  'DELETE /api/v1/steps/:stepId': {
    action: 'manage',
    subject: 'Flow',
  },
  'PATCH /api/v1/connections/:connectionId': {
    action: 'manage',
    subject: 'Connection',
  },
  'DELETE /api/v1/connections/:connectionId': {
    action: 'manage',
    subject: 'Connection',
  },
  'POST /api/v1/connections/:connectionId/reset': {
    action: 'manage',
    subject: 'Connection',
  },
  'PATCH /api/v1/flows/:flowId/status': {
    action: 'manage',
    subject: 'Flow',
  },
  'POST /api/v1/flows/:flowId/duplicate': {
    action: 'manage',
    subject: 'Flow',
  },
  'POST /api/v1/flows/:flowId/export': {
    action: 'manage',
    subject: 'Flow',
  },
  'POST /api/v1/flows/import': {
    action: 'manage',
    subject: 'Flow',
  },
  'POST /api/v1/flows/:flowId/steps': {
    action: 'manage',
    subject: 'Flow',
  },
  'POST /api/v1/apps/:appKey/connections': {
    action: 'manage',
    subject: 'Connection',
  },
  'POST /api/v1/connections/:connectionId/auth-url': {
    action: 'manage',
    subject: 'Connection',
  },
  'POST /api/v1/folders/': {
    action: 'manage',
    subject: 'Flow',
  },
  'PATCH /api/v1/folders/:folderId': {
    action: 'manage',
    subject: 'Flow',
  },
  'DELETE /api/v1/folders/:folderId': {
    action: 'manage',
    subject: 'Flow',
  },
  'GET /api/v1/folders/': {
    action: 'read',
    subject: 'Flow',
  },
  'PATCH /api/v1/flows/:flowId/folder': {
    action: 'manage',
    subject: 'Flow',
  },
  'GET /api/v1/flows/:flowId/folder': {
    action: 'read',
    subject: 'Flow',
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
