import { ApolloClient } from '@apollo/client';
import cache from './cache';
import createLink from './link';
import appConfig from 'config/app';

type CreateClientOptions = {
  onError?: (message: string) => void;
  token?: string | null;
};

const client = new ApolloClient({
  cache,
  link: createLink({ uri: appConfig.graphqlUrl }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});

export function mutateAndGetClient(
  options: CreateClientOptions
): typeof client {
  const { onError, token } = options;
  const link = createLink({ uri: appConfig.graphqlUrl, token, onError });

  client.setLink(link);

  return client;
}

export default client;
