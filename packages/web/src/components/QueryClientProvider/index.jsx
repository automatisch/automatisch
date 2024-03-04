import * as React from 'react';
import PropTypes from 'prop-types';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import api from 'helpers/api.js';
import useAuthentication from 'hooks/useAuthentication.js';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000,
      refetchOnWindowFocus: false,
      // provides a convenient default while it should be overridden for other HTTP methods
      queryFn: async ({ queryKey, signal }) => {
        const { data } = await api.get(queryKey[0], {
          signal,
        });

        return data;
      },
      retry: false,
    },
  },
});

export default function AutomatischQueryClientProvider({ children }) {
  const { token, initialize } = useAuthentication();

  React.useEffect(
    function updateTokenInHttpClient() {
      if (!initialize) return;

      if (token) {
        api.defaults.headers.Authorization = token;
      } else {
        delete api.defaults.headers.Authorization;
      }

      initialize();
    },
    [initialize, token],
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}

      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

AutomatischQueryClientProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
