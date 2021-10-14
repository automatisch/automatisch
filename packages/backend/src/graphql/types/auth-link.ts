import { GraphQLObjectType, GraphQLString } from 'graphql';

const authLinkType = new GraphQLObjectType({
  name: 'authLink',
  fields: {
    url: { type: GraphQLString }
  }
})

export default authLinkType;
