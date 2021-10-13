import { GraphQLObjectType,GraphQLString } from 'graphql';

const twitterCredentialInputType = new GraphQLObjectType({
  name: 'twitterCredential',
  fields: {
    consumerKey: { type: GraphQLString },
    consumerSecret: { type: GraphQLString },
  }
})

export default twitterCredentialInputType;
