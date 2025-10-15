import { useQuery } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useAgentTools(agentId) {
  const query = useQuery({
    queryKey: ['agents', agentId, 'tools'],
    queryFn: async () => {
      const { data } = await api.get(`/v1/agents/${agentId}/tools`);
      return data;
    },
    enabled: !!agentId,
  });

  return query;
}
