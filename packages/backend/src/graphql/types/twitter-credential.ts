import { GraphQLString, GraphQLObjectType } from 'graphql';

const twitterCredentialInputType = new GraphQLObjectType({
  name: 'TwitterCredential',
  fields: {
    consumerKey: { type: GraphQLString },
    consumerSecret: { type: GraphQLString },
  }
})

export default twitterCredentialInputType;
