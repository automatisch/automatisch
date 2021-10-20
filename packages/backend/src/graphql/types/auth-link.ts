import { GraphQLObjectType, GraphQLString } from 'graphql';

const authLinkType = new GraphQLObjectType({
  name: 'AuthLink',
  fields: {
    url: { type: GraphQLString }
  }
})

export default authLinkType;
