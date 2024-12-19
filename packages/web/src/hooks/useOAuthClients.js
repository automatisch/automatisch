import { useQuery } from '@tanstack/react-query';
import api from 'helpers/api';

export default function useOAuthClients(appKey) {
  const query = useQuery({
    queryKey: ['apps', appKey, 'oauth-clients'],
    queryFn: async ({ signal }) => {
      const { data } = await api.get(`/v1/apps/${appKey}/oauth-clients`, {
        signal,
      });
      return data;
    },
    enabled: !!appKey,
  });

  return query;
}
