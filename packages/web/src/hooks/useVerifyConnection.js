import { useMutation } from '@tanstack/react-query';
import api from 'helpers/api';

export default function useVerifyConnection() {
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
  });

  return query;
}
