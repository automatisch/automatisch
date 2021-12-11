import { HttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';

type CreateLinkOptions = {
  uri: string;
  onError?: (message: string) => void;
};

const createHttpLink = (uri: CreateLinkOptions['uri']) => new HttpLink({ uri });

const createErrorLink = (callback: CreateLinkOptions['onError']) => onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) => {
      callback?.(message);

      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      );
    });

  if (networkError) {
    callback?.(networkError.toString())
    console.log(`[Network error]: ${networkError}`);
  }
});

const createLink = ({ uri, onError = function() {} }: CreateLinkOptions) => {
  return from([createErrorLink(onError), createHttpLink(uri)]);
};

export default createLink;
