import { GraphQLObjectType, GraphQLString, GraphQLInt } from 'graphql';

const userType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLInt },
    email: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString }
  }
})

export default userType;
