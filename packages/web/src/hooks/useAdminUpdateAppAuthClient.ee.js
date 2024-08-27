import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from 'helpers/api';

export default function useAdminUpdateAppAuthClient(appKey, id) {
  const queryClient = useQueryClient();

  const query = useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.patch(
        `/v1/admin/apps/${appKey}/auth-clients/${id}`,
        payload,
      );

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin', 'apps', appKey, 'authClients', id],
      });

      queryClient.invalidateQueries({
        queryKey: ['admin', 'apps', appKey, 'authClients'],
      });
    },
  });

  return query;
}
