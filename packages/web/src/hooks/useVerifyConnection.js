import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from 'helpers/api';

export default function useVerifyConnection() {
  const queryClient = useQueryClient();

  const query = useMutation({
    mutationFn: async (connectionId) => {
      try {
        const { data } = await api.post(
          `/v1/connections/${connectionId}/verify`,
        );

        return data;
      } catch {
        throw new Error('Failed while verifying connection!');
      }
    },
    onSuccess: (data) => {
      const appKey = data?.data.key;
      queryClient.invalidateQueries({
        queryKey: ['apps', appKey, 'connections'],
      });
    },
  });

  return query;
}
