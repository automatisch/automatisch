import * as React from 'react';
import { ApolloProvider as BaseApolloProvider } from '@apollo/client';
import { useSnackbar } from 'notistack';

import client, { setLink } from 'graphql/client';
import useAuthentication from 'hooks/useAuthentication';

type ApolloProviderProps = {
  children: React.ReactNode;
};

const ApolloProvider = (props: ApolloProviderProps): React.ReactElement => {
  const { enqueueSnackbar } = useSnackbar();
  const authentication = useAuthentication();

  const onError = React.useCallback((message) => {
    enqueueSnackbar(message, { variant: 'error' });
  }, [enqueueSnackbar]);

  React.useEffect(() => {
    setLink({ onError, token: authentication.token })
  },  [onError, authentication]);

  return (
    <BaseApolloProvider client={client} {...props} />
  );
};

export default ApolloProvider;
