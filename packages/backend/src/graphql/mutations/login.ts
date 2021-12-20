import { GraphQLString, GraphQLNonNull } from 'graphql';
import User from '../../models/user';
import userType from '../types/user';

type Params = {
  email: string,
  password: string
}
const loginResolver = async (params: Params) => {
  const user = await User.query().findOne({
    email: params.email,
  });

  if (user && await user.login(params.password)) {
    return user;
  }

  throw new Error('User could not be found.')
}

const login = {
  type: userType,
  args: {
    email: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) }
  },
  resolve: (_: any, params: any) => loginResolver(params)
};

export default login;
