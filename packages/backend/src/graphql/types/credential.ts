import { GraphQLObjectType, GraphQLString } from 'graphql';
import twitterCredentialType from './twitter-credential';

const credentialType = new GraphQLObjectType({
  name: 'credential',
  fields: {
    id: { type: GraphQLString },
    key: { type: GraphQLString },
    data: { type: twitterCredentialType },
  }
})

export default credentialType;
