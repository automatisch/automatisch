import * as React from 'react';
import PropTypes from 'prop-types';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import api from 'helpers/api.js';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000,
      retryOnMount: false,
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
