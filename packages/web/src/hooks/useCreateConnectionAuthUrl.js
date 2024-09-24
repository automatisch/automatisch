import { useMutation } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useCreateConnectionAuthUrl() {
  const query = useMutation({
    mutationFn: async (connectionId) => {
      const { data } = await api.post(
        `/v1/connections/${connectionId}/auth-url`,
      );

      return data;
    },
  });

  return query;
}
