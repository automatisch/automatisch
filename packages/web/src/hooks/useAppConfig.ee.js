import { useQuery } from '@tanstack/react-query';
import api from 'helpers/api';

export default function useAppConfig(appKey) {
  const query = useQuery({
    queryKey: ['apps', appKey, 'config'],
    queryFn: async ({ signal }) => {
      const { data } = await api.get(`/v1/apps/${appKey}/config`, {
        signal,
      });

      return data;
    },
  });

  return query;
}
