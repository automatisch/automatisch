import { useMutation } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useRevokeAccessToken(token) {
  const query = useMutation({
    mutationFn: async () => {
      const { data } = await api.delete(`/v1/access-tokens/${token}`);

      return data;
    },
  });

  return query;
}
