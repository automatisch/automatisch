import { useMutation } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useResetPassword() {
  const mutation = useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post('/v1/users/reset-password', payload);

      return data;
    },
  });

  return mutation;
}
