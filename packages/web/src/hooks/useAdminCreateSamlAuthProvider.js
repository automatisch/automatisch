import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from 'helpers/api';

export default function useAdminCreateSamlAuthProvider() {
  const queryClient = useQueryClient();

  const query = useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post(`/v1/admin/saml-auth-providers`, payload);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin', 'samlAuthProviders'],
      });
    },
  });

  return query;
}
