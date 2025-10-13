import { useQuery } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useAgent(agentId) {
  const query = useQuery({
    queryKey: ['agents', agentId],
    queryFn: async ({ signal }) => {
      const { data } = await api.get(`/v1/agents/${agentId}`, {
        signal,
      });

      return data;
    },
    enabled: !!agentId,
  });

  return query;
}
