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
      } catch (err) {
        if (err.response.status === 500) {
          throw new Error('Failed while verifying connection!');
        }

        throw err;
      }
    },
  });

  return query;
}
