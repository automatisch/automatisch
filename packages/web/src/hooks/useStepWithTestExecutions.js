import { useQuery } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useStepWithTestExecutions(stepId) {
  const query = useQuery({
    queryKey: ['steps', stepId, 'previousSteps'],
    queryFn: async ({ signal }) => {
      const { data } = await api.get(`/v1/steps/${stepId}/previous-steps`, {
        signal,
      });

      return data;
    },
    enabled: false,
  });

  return query;
}
