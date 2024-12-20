import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from 'helpers/api';

export default function useAdminUpdateOAuthClient(appKey, id) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.patch(
        `/v1/admin/apps/${appKey}/oauth-clients/${id}`,
        payload,
      );

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin', 'apps', appKey, 'oauthClients', id],
      });

      queryClient.invalidateQueries({
        queryKey: ['admin', 'apps', appKey, 'oauthClients'],
      });
    },
  });

  return mutation;
}
