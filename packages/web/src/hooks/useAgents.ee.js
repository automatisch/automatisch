import { useQuery } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useAgents() {
  const query = useQuery({
    queryKey: ['agents'],
    queryFn: async ({ signal }) => {
      const { data } = await api.get('/v1/agents', {
        signal,
      });

      return data;
    },
  });

  return query;
}
