import { GraphQLObjectType, GraphQLString, GraphQLList } from 'graphql';
import fieldType from './field';

const appType = new GraphQLObjectType({
  name: 'App',
  fields: {
    name: { type: GraphQLString },
    iconUrl: { type: GraphQLString },
    docUrl: { type: GraphQLString },
    fields: { type: GraphQLList(fieldType) }
  }
});

export default appType;
