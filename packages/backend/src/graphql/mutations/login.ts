import { GraphQLString, GraphQLNonNull } from 'graphql';
import User from '../../models/user';
import authType from '../types/auth';
import jwt from 'jsonwebtoken';
import appConfig from '../../config/app';

type Params = {
  email: string;
  password: string;
};

const loginResolver = async (params: Params) => {
  const user = await User.query().findOne({
    email: params.email,
  });

  if (user && (await user.login(params.password))) {
    const token = jwt.sign({ userId: user.id }, appConfig.appSecretKey);

    return { token, user };
  }

  throw new Error('User could not be found.');
};

const login = {
  type: authType,
  args: {
    email: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) },
  },
  resolve: (_: any, params: any) => loginResolver(params),
};

export default login;
