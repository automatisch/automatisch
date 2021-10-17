import { ApolloClient } from '@apollo/client';
import cache from './cache';
import appConfig from 'config/app';

const client = new ApolloClient({
  uri: appConfig.graphqlUrl,
  cache
});

export default client;
