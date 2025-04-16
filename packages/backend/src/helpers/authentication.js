import User from '../models/user.js';
import AccessToken from '../models/access-token.js';
import ApiToken from '../models/api-token.ee.js';

export const isAuthenticated = async (req) => {
  const token = req.headers['authorization'];

  if (token == null) return false;

  try {
    const accessToken = await AccessToken.query().findOne({
      token,
      revoked_at: null,
    });

    const expirationTime =
      new Date(accessToken.createdAt).getTime() + accessToken.expiresIn * 1000;

    if (Date.now() > expirationTime) {
      return false;
    }

    const user = await accessToken.$relatedQuery('user');

    req.currentUser = await User.query()
      .findById(user.id)
      .leftJoinRelated({
        role: true,
        permissions: true,
      })
      .withGraphFetched({
        role: true,
        permissions: true,
      })
      .throwIfNotFound();

    return true;
  } catch (error) {
    return false;
  }
};

export const authenticateUser = async (request, response, next) => {
  if (await isAuthenticated(request)) {
    next();
  } else {
    return response.status(401).end();
  }
};

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
