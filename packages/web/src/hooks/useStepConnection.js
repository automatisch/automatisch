import { useQuery } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useStepConnection(stepId) {
  const query = useQuery({
    queryKey: ['steps', stepId, 'connection'],
    queryFn: async ({ signal }) => {
      try {
        const { data } = await api.get(`/v1/steps/${stepId}/connection`, {
          signal,
        });

        return data;
      } catch (error) {
        if (error.response?.status === 404) {
          return null;
        }
        throw error;
      }
    },
    enabled: !!stepId,
  });

  return query;
}
