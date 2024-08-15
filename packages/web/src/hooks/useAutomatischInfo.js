import { useQuery } from '@tanstack/react-query';
import api from 'helpers/api';

export default function useAutomatischInfo() {
  const query = useQuery({
    /**
     * The data doesn't change by user actions, but only by server deployments.
     * So we can set the `staleTime` to Infinity
     **/
    staleTime: Infinity,
    queryKey: ['automatisch', 'info'],
    queryFn: async (payload, signal) => {
      const { data } = await api.get('/v1/automatisch/info', { signal });

      return data;
    },
  });

  return query;
}
