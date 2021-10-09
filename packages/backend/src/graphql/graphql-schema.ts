import { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLList, GraphQLNonNull } from 'graphql';
import getApps from './queries/get-apps';
import getApp from './queries/get-app';
import appType from './types/app';

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    getApps: {
      type: GraphQLList(GraphQLString),
      args: {
        name: { type: GraphQLString }
      },
      resolve: (_, { name }) => getApps(name)
    },
    getApp: {
      type: appType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: (_, { name }) => getApp(name)
    },
  }
});

var graphQLSchema = new GraphQLSchema({
  query: queryType,
});

export default graphQLSchema;
