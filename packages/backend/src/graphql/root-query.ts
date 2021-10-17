import { GraphQLObjectType } from 'graphql';
import getApps from './queries/get-apps';
import getApp from './queries/get-app';
import getConnectedApps from './queries/get-connected-apps';

const rootQuery = new GraphQLObjectType({
  name: 'Query',
  fields: {
    getApps,
    getApp,
    getConnectedApps
  }
});

export default rootQuery;
