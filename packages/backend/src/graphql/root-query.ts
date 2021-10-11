import { GraphQLObjectType } from 'graphql';
import getApps from './queries/get-apps';
import getApp from './queries/get-app';

const rootQuery = new GraphQLObjectType({
  name: 'Query',
  fields: {
    getApps: getApps,
    getApp: getApp
  }
});

export default rootQuery;
