import { useQuery } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useFlowFolder(flowId) {
  const query = useQuery({
    queryKey: ['flows', flowId, 'folder'],
    queryFn: async ({ signal }) => {
      const { data } = await api.get(`/v1/flows/${flowId}/folder`, {
        signal,
      });

      return data;
    },
  });

  return query;
}
