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
    action: 'create',
    subject: 'Flow',
  },
  'PATCH /api/v1/flows/:flowId': {
    action: 'update',
    subject: 'Flow',
  },
  'DELETE /api/v1/flows/:flowId': {
    action: 'delete',
    subject: 'Flow',
  },
  'GET /api/v1/steps/:stepId/connection': {
    action: 'read',
    subject: 'Flow',
  },
  'PATCH /api/v1/steps/:stepId': {
    action: 'update',
    subject: 'Flow',
  },
  'POST /api/v1/steps/:stepId/test': {
    action: 'update',
    subject: 'Flow',
  },
  'GET /api/v1/steps/:stepId/previous-steps': {
    action: 'update',
    subject: 'Flow',
  },
  'POST /api/v1/steps/:stepId/dynamic-fields': {
    action: 'update',
    subject: 'Flow',
  },
  'POST /api/v1/steps/:stepId/dynamic-data': {
    action: 'update',
    subject: 'Flow',
  },
  'GET /api/v1/connections/:connectionId/flows': {
    action: 'read',
    subject: 'Flow',
  },
  'POST /api/v1/connections/:connectionId/test': {
    action: 'update',
    subject: 'Connection',
  },
  'POST /api/v1/connections/:connectionId/verify': {
    action: 'create',
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
    action: 'update',
    subject: 'Flow',
  },
  'PATCH /api/v1/connections/:connectionId': {
    action: 'update',
    subject: 'Connection',
  },
  'DELETE /api/v1/connections/:connectionId': {
    action: 'delete',
    subject: 'Connection',
  },
  'POST /api/v1/connections/:connectionId/reset': {
    action: 'create',
    subject: 'Connection',
  },
  'PATCH /api/v1/flows/:flowId/status': {
    action: 'publish',
    subject: 'Flow',
  },
  'POST /api/v1/flows/:flowId/duplicate': {
    action: 'create',
    subject: 'Flow',
  },
  'POST /api/v1/flows/:flowId/export': {
    action: 'update',
    subject: 'Flow',
  },
  'POST /api/v1/flows/import': {
    action: 'create',
    subject: 'Flow',
  },
  'POST /api/v1/flows/:flowId/steps': {
    action: 'update',
    subject: 'Flow',
  },
  'POST /api/v1/apps/:appKey/connections': {
    action: 'create',
    subject: 'Connection',
  },
  'POST /api/v1/connections/:connectionId/auth-url': {
    action: 'create',
    subject: 'Connection',
  },
  'POST /api/v1/folders/': {
    action: 'create',
    subject: 'Flow',
  },
  'PATCH /api/v1/folders/:folderId': {
    action: 'create',
    subject: 'Flow',
  },
  'DELETE /api/v1/folders/:folderId': {
    action: 'create',
    subject: 'Flow',
  },
  'GET /api/v1/folders/': {
    action: 'read',
    subject: 'Flow',
  },
  'PATCH /api/v1/flows/:flowId/folder': {
    action: 'update',
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
