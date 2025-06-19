import { useMutation } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useResetConnection() {
  const query = useMutation({
    mutationFn: async (connectionId) => {
      const { data } = await api.post(`/v1/connections/${connectionId}/reset`);

      return data;
    },
  });

  return query;
}
