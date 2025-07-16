import { useMutation } from '@tanstack/react-query';
import api from 'helpers/api';

export default function useTestAndContinueStep(stepId) {
  const query = useMutation({
    mutationFn: async () => {
      const { data } = await api.post(`/v1/steps/${stepId}/test-and-continue`);

      return data;
    },
  });

  return query;
}
