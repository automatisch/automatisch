import { useQuery } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useStepConnection(stepId) {
  const query = useQuery({
    queryKey: ['steps', stepId, 'connection'],
    queryFn: async ({ signal }) => {
      const { data } = await api.get(`/v1/steps/${stepId}/connection`, {
        signal,
      });

      return data;
    },
    enabled: !!stepId,
  });

  return query;
}
