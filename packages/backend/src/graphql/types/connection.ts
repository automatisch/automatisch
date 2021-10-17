import { GraphQLObjectType, GraphQLString, GraphQLBoolean } from 'graphql';
import twitterCredentialType from './twitter-credential';

const connectionType = new GraphQLObjectType({
  name: 'connection',
  fields: {
    id: { type: GraphQLString },
    key: { type: GraphQLString },
    data: { type: twitterCredentialType },
    verified: { type: GraphQLBoolean },
  }
})

export default connectionType;
