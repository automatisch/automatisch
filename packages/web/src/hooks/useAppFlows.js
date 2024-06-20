import { useQuery } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useAppFlows({ appKey, page }, { enabled }) {
  const query = useQuery({
    queryKey: ['apps', appKey, 'flows', { page }],
    queryFn: async ({ signal }) => {
      const { data } = await api.get(`/v1/apps/${appKey}/flows`, {
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
