import { GraphQLObjectType } from 'graphql';

import getApp from './queries/get-app';
import getApps from './queries/get-apps';

const rootQuery = new GraphQLObjectType({
  name: 'Query',
  fields: {
    getApps: getApps,
    getApp: getApp
  }
});

export default rootQuery;
