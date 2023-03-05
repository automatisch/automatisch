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
    req.currentUser = await User.query().findById(userId).throwIfNotFound();

    return true;
  } catch (error) {
    return false;
  }
});

const authentication = shield(
  {
    Query: {
      '*': isAuthenticated,
      healthcheck: allow,
    },
    Mutation: {
      '*': isAuthenticated,
      login: allow,
      createUser: allow,
      forgotPassword: allow,
      resetPassword: allow,
    },
  },
  {
    allowExternalErrors: true,
  }
);

export default authentication;
