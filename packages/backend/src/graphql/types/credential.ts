import { GraphQLObjectType, GraphQLString, GraphQLBoolean } from 'graphql';
import twitterCredentialType from './twitter-credential';

const credentialType = new GraphQLObjectType({
  name: 'credential',
  fields: {
    id: { type: GraphQLString },
    key: { type: GraphQLString },
    data: { type: twitterCredentialType },
    verified: { type: GraphQLBoolean },
  }
})

export default credentialType;
