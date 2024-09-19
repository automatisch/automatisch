import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from 'helpers/api';

export default function useUpdateFlowStatus(flowId) {
  const queryClient = useQueryClient();

  const query = useMutation({
    mutationFn: async (active) => {
      const { data } = await api.patch(`/v1/flows/${flowId}/status`, {
        active,
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['flows', flowId],
      });
    },
  });

  return query;
}
