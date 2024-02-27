import { HttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setItem } from 'helpers/storage';
import * as URLS from 'config/urls';
const createHttpLink = (options) => {
  const { uri, token } = options;
  const headers = {
    authorization: token,
  };
  return new HttpLink({ uri, headers });
};
const NOT_AUTHORISED = 'Not Authorised!';
const createErrorLink = (callback) =>
  onError(({ graphQLErrors, networkError, operation }) => {
    const context = operation.getContext();
    const autoSnackbar = context.autoSnackbar ?? true;
    if (graphQLErrors)
      graphQLErrors.forEach(({ message, locations, path }) => {
        if (autoSnackbar) {
          callback?.(message);
        }
        console.error(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
        );
        if (message === NOT_AUTHORISED) {
          setItem('token', '');
          if (window.location.pathname !== URLS.LOGIN) {
            window.location.href = URLS.LOGIN;
          }
        }
      });
    if (networkError) {
      if (autoSnackbar) {
        callback?.(networkError.toString());
      }
      console.error(`[Network error]: ${networkError}`);
    }
  });

const noop = () => {};
const createLink = (options) => {
  const { uri, onError = noop, token } = options;
  const httpOptions = { uri, token };
  return from([createErrorLink(onError), createHttpLink(httpOptions)]);
};
export default createLink;
