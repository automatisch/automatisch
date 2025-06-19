import { useQuery } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useFlowForm(flowId) {
  const query = useQuery({
    queryKey: ['flows', flowId, 'form'],
    queryFn: async ({ signal }) => {
      const { data } = await api.get(`/v1/flows/${flowId}/form`, {
        signal,
      });

      return data;
    },
  });

  return query;
}
