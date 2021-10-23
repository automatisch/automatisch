import { ApolloClient } from '@apollo/client';
import cache from './cache';
import createLink from './link';
import appConfig from 'config/app';

type CreateClientOptions = {
  onError?: (message: string) => void;
};

const client = new ApolloClient({
  cache,
  link: createLink({ uri: appConfig.graphqlUrl })
});

export function setLink({ onError }: CreateClientOptions) {
  const link = createLink({ uri: appConfig.graphqlUrl, onError });

  client.setLink(link);

  return client;
};

export default client;
