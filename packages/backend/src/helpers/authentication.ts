import { allow, rule, shield } from 'graphql-shield';
import jwt from 'jsonwebtoken';
import appConfig from '../config/app';
import User from '../models/user';

const isAuthenticated = rule()(async (_parent, _args, req) => {
  const token = req.headers['authorization'];

  if (token == null) return false;

  try {
    const { userId } = jwt.verify(token, appConfig.appSecretKey) as {
      userId: string;
    };
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
});

const authentication = shield(
  {
    Query: {
      '*': isAuthenticated,
      getAutomatischInfo: allow,
      getConfig: allow,
      getNotifications: allow,
      healthcheck: allow,
      listSamlAuthProviders: allow,
    },
    Mutation: {
      '*': isAuthenticated,
      forgotPassword: allow,
      login: allow,
      registerUser: allow,
      resetPassword: allow,
    },
  },
  {
    allowExternalErrors: true,
  }
);

export default authentication;
