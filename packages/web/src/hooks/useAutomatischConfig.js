import { useQuery } from '@tanstack/react-query';
import api from 'helpers/api';

export default function useAutomatischConfig() {
  const query = useQuery({
    queryKey: ['automatisch', 'config'],
    queryFn: async ({ signal }) => {
      const { data } = await api.get(`/v1/automatisch/config`, {
        signal,
      });

      return data;
    },
  });

  return query;
}
