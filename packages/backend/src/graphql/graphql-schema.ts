import { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLList } from 'graphql';
import getApps from './queries/get-apps';

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    getApps: {
      type: GraphQLList(GraphQLString),
      args: {
        name: { type: GraphQLString }
      },
      resolve: (_, { name }) => getApps(name)
    }
  }
});

var graphQLSchema = new GraphQLSchema({
  query: queryType,
});

export default graphQLSchema;
