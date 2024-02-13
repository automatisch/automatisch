import { allow, rule, shield } from 'graphql-shield';
import jwt from 'jsonwebtoken';
import appConfig from '../config/app.js';
import User from '../models/user.js';

export const isAuthenticated = async (_parent, _args, req) => {
  const token = req.headers['authorization'];

  if (token == null) return false;

  try {
    const { userId } = jwt.verify(token, appConfig.appSecretKey);

    req.currentUser = await User.query()
      .findById(userId)
      .leftJoinRelated({
        role: true,
        permissions: true,
      })
      .withGraphFetched({
        role: true,
        permissions: true,
      });

    return true;
  } catch (error) {
    return false;
  }
};

export const authenticateUser = async (request, response, next) => {
  if (await isAuthenticated(null, null, request)) {
    next();
  } else {
    return response.status(401).end();
  }
};

const isAuthenticatedRule = rule()(isAuthenticated);

export const authenticationRules = {
  Query: {
    '*': isAuthenticatedRule,
    getAutomatischInfo: allow,
    getConfig: allow,
    getNotifications: allow,
    healthcheck: allow,
    listSamlAuthProviders: allow,
  },
  Mutation: {
    '*': isAuthenticatedRule,
    forgotPassword: allow,
    login: allow,
    registerUser: allow,
    resetPassword: allow,
  },
};

const authenticationOptions = {
  allowExternalErrors: true,
};

const authentication = shield(authenticationRules, authenticationOptions);

export default authentication;
