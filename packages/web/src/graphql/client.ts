import { ApolloClient, InMemoryCache } from '@apollo/client';
import appConfig from 'config/app';

const cache = new InMemoryCache();
const client = new ApolloClient({
  uri: appConfig.graphqlUrl,
  cache
});

export default client;
