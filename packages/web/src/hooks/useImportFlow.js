import { useMutation, useQueryClient } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useImportFlow() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (flowData) => {
      const { data } = await api.post('/v1/flows/import', flowData);

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
