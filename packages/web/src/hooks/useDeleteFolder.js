import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from 'helpers/api';

export default function useDeleteFolder() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id) => {
      const { data } = await api.delete(`/v1/folders/${id}`);

      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['folders'],
      });
    },
  });

  return mutation;
}
