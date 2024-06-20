import { useQuery } from '@tanstack/react-query';
import api from 'helpers/api';

export default function useAutomatischNotifications() {
  const query = useQuery({
    queryKey: ['automatisch', 'notifications'],
    queryFn: async ({ signal }) => {
      const { data } = await api.get(`/v1/automatisch/notifications`, {
        signal,
      });
      return data;
    },
  });

  return query;
}
