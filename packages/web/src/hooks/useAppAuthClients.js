import { useQuery } from '@tanstack/react-query';
import api from 'helpers/api';

export default function useAppAuthClients(appKey) {
  const query = useQuery({
    queryKey: ['apps', appKey, 'auth-clients'],
    queryFn: async ({ signal }) => {
      const { data } = await api.get(`/v1/apps/${appKey}/auth-clients`, {
        signal,
      });
      return data;
    },
    enabled: !!appKey,
  });

  return query;
}
