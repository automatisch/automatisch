import { GraphQLObjectType, GraphQLString } from 'graphql';
import twitterCredentialType from './twitter-credential';

const credentialType = new GraphQLObjectType({
  name: 'credential',
  fields: {
    key: { type: GraphQLString },
    displayName: { type: GraphQLString },
    data: { type: twitterCredentialType },
  }
})

export default credentialType;
