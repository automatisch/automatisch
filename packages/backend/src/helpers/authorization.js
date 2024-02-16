const authorizationList = {
  '/api/v1/users/:userId': {
    action: 'read',
    subject: 'User',
  },
  '/api/v1/users/': {
    action: 'read',
    subject: 'User',
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
