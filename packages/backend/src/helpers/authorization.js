const authorizationList = {
  '/api/v1/users/:userId': {
    action: 'read',
    subject: 'User',
  },
  '/api/v1/users/': {
    action: 'read',
    subject: 'User',
  },
  'GET /api/v1/admin/saml-auth-providers/': {
    action: 'read',
    subject: 'SamlAuthProvider',
  },
};

export const authorizeUser = async (request, response, next) => {
  const currentRoute = request.baseUrl + request.route.path;
  const currentRouteRule = authorizationList[currentRoute];

  try {
    request.currentUser.can(currentRouteRule.action, currentRouteRule.subject);
    next();
  } catch (error) {
    return response.status(403).end();
  }
};

export const authorizeAdmin = async (request, response, next) => {
  const role = await request.currentUser.$relatedQuery('role');

  if (role?.isAdmin) {
    next();
  } else {
    return response.status(403).end();
  }
};
