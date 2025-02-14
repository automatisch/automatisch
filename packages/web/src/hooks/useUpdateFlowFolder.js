import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from 'helpers/api';

export default function useUpdateFlowFolder(flowId) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (folderId) => {
      const { data } = await api.patch(`/v1/flows/${flowId}/folder`, {
        folderId,
      });

      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['flows'],
      });
    },
  });

  return mutation;
}
