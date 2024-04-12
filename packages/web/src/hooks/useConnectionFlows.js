import { useQuery } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useConnectionFlows(
  { connectionId, page },
  { enabled } = {},
) {
  const query = useQuery({
    queryKey: ['connections', connectionId, 'flows', { page }],
    queryFn: async ({ signal }) => {
      const { data } = await api.get(`/v1/connections/${connectionId}/flows`, {
        params: {
          page,
        },
        signal,
      });

      return data;
    },
    enabled,
  });

  return query;
}
