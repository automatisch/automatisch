import { ApolloProvider as BaseApolloProvider } from '@apollo/client';
import * as React from 'react';

import { mutateAndGetClient } from 'graphql/client';
import useAuthentication from 'hooks/useAuthentication';
import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';

type ApolloProviderProps = {
  children: React.ReactNode;
};

const ApolloProvider = (props: ApolloProviderProps): React.ReactElement => {
  const enqueueSnackbar = useEnqueueSnackbar();
  const authentication = useAuthentication();

  const onError = React.useCallback(
    (message) => {
      enqueueSnackbar(message, {
        variant: 'error',
        SnackbarProps: {
          'data-test': 'snackbar-error'
        }
      });
    },
    [enqueueSnackbar]
  );

  const client = React.useMemo(() => {
    return mutateAndGetClient({
      onError,
      token: authentication.token,
    });
  }, [onError, authentication]);

  return <BaseApolloProvider client={client} {...props} />;
};

export default ApolloProvider;
