import ApiToken from '../models/api-token.ee.js';

export const isApiTokenAuthenticated = async (request) => {
  const token = request.headers['x-api-token'];

  if (token == null) return false;

  try {
    const apiToken = await ApiToken.query().findOne({
      token,
    });

    if (apiToken == null) return false;

    return true;
  } catch (error) {
    return false;
  }
};

export const authenticateApiToken = async (request, response, next) => {
  if (await isApiTokenAuthenticated(request)) {
    next();
  } else {
    return response.status(401).end();
  }
};
