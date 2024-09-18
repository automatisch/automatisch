import { useMutation, useQueryClient } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useUpdateStep() {
  const queryClient = useQueryClient();

  const query = useMutation({
    mutationFn: async ({ id, appKey, key, connectionId, parameters }) => {
      const { data } = await api.patch(`/v1/steps/${id}`, {
        appKey,
        key,
        connectionId,
        parameters,
      });

      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['flows'],
      });
    },
  });

  return query;
}
