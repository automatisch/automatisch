import { HttpLink, from } from '@apollo/client';
import type { ApolloLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';

import * as URLS from 'config/urls';

type CreateLinkOptions = {
  uri: string;
  token?: string | null;
  onError?: (message: string) => void;
};

const createHttpLink = (options: Pick<CreateLinkOptions, 'uri' | 'token'>): ApolloLink => {
  const { uri, token } = options;
  const headers = {
    authorization: token,
  };
  return new HttpLink({ uri, headers });
}

const NOT_AUTHORISED = 'Not Authorised!';
const createErrorLink = (callback: CreateLinkOptions['onError']): ApolloLink => onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) => {
      callback?.(message);

      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      );

      if (message === NOT_AUTHORISED) {
        window.location.href = URLS.LOGIN;
      }
    });

  if (networkError) {
    callback?.(networkError.toString())
    console.log(`[Network error]: ${networkError}`);
  }
});

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

const createLink = (options: CreateLinkOptions): ApolloLink => {
  const {
    uri,
    onError = noop,
    token,
  } = options;

  const httpOptions = { uri, token };

  return from([createErrorLink(onError), createHttpLink(httpOptions)]);
};

export default createLink;
