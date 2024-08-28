import { useMutation } from '@tanstack/react-query';
import api from 'helpers/api';

export default function useDeleteConnection() {
  const query = useMutation({
    mutationFn: async (connectionId) => {
      const { data } = await api.delete(`/v1/connections/${connectionId}`);

      return data;
    },
  });

  return query;
}
