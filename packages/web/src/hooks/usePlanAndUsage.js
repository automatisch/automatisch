import { useQuery } from '@tanstack/react-query';

import api from 'helpers/api';

export default function usePlanAndUsage(userId) {
  const query = useQuery({
    queryKey: ['users', userId, 'planAndUsage'],
    queryFn: async ({ signal }) => {
      const { data } = await api.get(`/v1/users/${userId}/plan-and-usage`, {
        signal,
      });

      return data;
    },
    enabled: !!userId,
  });

  return query;
}
