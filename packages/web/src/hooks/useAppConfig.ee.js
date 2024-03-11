import { useQuery } from '@tanstack/react-query';
import api from 'helpers/api';

export default function useAppConfig(appKey) {
  const query = useQuery({
    queryKey: ['appConfig', appKey],
    queryFn: async ({ payload, signal }) => {
      const { data } = await api.get(`/v1/app-configs/${appKey}`, {
        signal,
      });

      return data;
    },
  });

  return query;
}
