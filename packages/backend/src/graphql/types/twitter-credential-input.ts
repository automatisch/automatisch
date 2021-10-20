import { GraphQLString, GraphQLInputObjectType } from 'graphql';

const twitterCredentialInputType = new GraphQLInputObjectType({
  name: 'TwitterCredentialInput',
  fields: {
    consumerKey: { type: GraphQLString },
    consumerSecret: { type: GraphQLString },
    oauthVerifier: { type: GraphQLString },
  }
})

export default twitterCredentialInputType;
