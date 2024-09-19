import { useMutation } from '@tanstack/react-query';
import api from 'helpers/api';

export default function useDeleteStep() {
  const query = useMutation({
    mutationFn: async (stepId) => {
      const { data } = await api.delete(`/v1/steps/${stepId}`);

      return data;
    },
  });

  return query;
}
