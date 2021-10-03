import { ApolloClient, InMemoryCache } from '@apollo/client';

const cache = new InMemoryCache();
const client = new ApolloClient({ cache: cache });

export default client;
