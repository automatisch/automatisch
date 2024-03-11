import { useQuery } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useApps(variables) {
  const query = useQuery({
    queryKey: ['apps', variables],
    queryFn: async ({ payload, signal }) => {
      const { data } = await api.get('/v1/apps', {
        params: variables,
        signal,
      });

      return data;
    },
  });

  return query;
}
