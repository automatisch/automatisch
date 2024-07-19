import { useMutation } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useCreateAccessToken() {
  const query = useMutation({
    mutationFn: async ({ email, password }) => {
      const { data } = await api.post('/v1/access-tokens', { email, password });

      return data;
    },
  });

  return query;
}
