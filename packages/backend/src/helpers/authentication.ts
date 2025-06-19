import { rule, shield, allow } from 'graphql-shield';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import appConfig from '../config/app';

const isAuthenticated = rule()(async (_parent, _args, req) => {
  const token = req.headers['authorization'];

  if (token == null) return false;

  try {
    const { userId } = jwt.verify(token, appConfig.appSecretKey) as {
      userId: string;
    };
    req.currentUser = await User
      .query()
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
      getSamlAuthProviders: allow,
      healthcheck: allow,
    },
    Mutation: {
      '*': isAuthenticated,
      registerUser: allow,
      forgotPassword: allow,
      login: allow,
      resetPassword: allow,
    },
  },
  {
    allowExternalErrors: true,
  }
);

export default authentication;
