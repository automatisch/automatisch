import { GraphQLObjectType } from 'graphql';
import getApps from './queries/get-apps';
import getApp from './queries/get-app';
import getConnectedApps from './queries/get-connected-apps';
import getAppConnections from './queries/get-app-connections';
import testConnection from './queries/test-connection';

const rootQuery = new GraphQLObjectType({
  name: 'Query',
  fields: {
    getApps,
    getApp,
    getConnectedApps,
    getAppConnections,
    testConnection
  }
});

export default rootQuery;
