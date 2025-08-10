import { useMutation, useQueryClient } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useCreateStep(flowId) {
  const queryClient = useQueryClient();
  const query = useMutation({
    mutationFn: async ({ previousStepId, structuralType, parentStepId }) => {
      const { data } = await api.post(`/v1/flows/${flowId}/steps`, {
        previousStepId,
        structuralType,
        parentStepId,
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
