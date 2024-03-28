import { useQuery } from '@tanstack/react-query';

import api from 'helpers/api';
import useCurrentUser from './useCurrentUser';

export default function usePlanAndUsage() {
  const { data } = useCurrentUser();
  const currentUserId = data?.data?.id;

  const query = useQuery({
    queryKey: ['planAndUsage', currentUserId],
    queryFn: async ({ signal }) => {
      const { data } = await api.get(
        `/v1/users/${currentUserId}/plan-and-usage`,
        {
          signal,
        },
      );

      return data;
    },
  });

  return query;
}
