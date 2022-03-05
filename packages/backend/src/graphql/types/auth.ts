import { GraphQLObjectType, GraphQLString } from 'graphql';
import UserType from './user';

const authType = new GraphQLObjectType({
  name: 'Auth',
  fields: {
    user: { type: UserType },
    token: { type: GraphQLString },
  },
});

export default authType;
