import { useMutation } from '@tanstack/react-query';
import api from 'helpers/api';

export default function useTestStep(stepId) {
  const query = useMutation({
    mutationFn: async () => {
      const { data } = await api.post(`/v1/steps/${stepId}/test`);

      return data;
    },
  });

  return query;
}
