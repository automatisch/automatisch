import { GraphQLObjectType, GraphQLString, GraphQLBoolean } from 'graphql';
import connectionDataType from './connection-data';

const connectionType = new GraphQLObjectType({
  name: 'connection',
  fields: {
    id: { type: GraphQLString },
    key: { type: GraphQLString },
    data: { type: connectionDataType },
    verified: { type: GraphQLBoolean },
  }
})

export default connectionType;
