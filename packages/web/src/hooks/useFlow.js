import { useQuery } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useFlow(flowId) {
  const query = useQuery({
    queryKey: ['flows', flowId],
    queryFn: async ({ signal }) => {
      const { data } = await api.get(`/v1/flows/${flowId}`, {
        signal,
      });

      return data;
    },
    enabled: !!flowId,
  });

  return query;
}
