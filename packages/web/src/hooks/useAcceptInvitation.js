import { useMutation } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useAcceptInvitation() {
  const mutation = useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post('/v1/users/invitation', payload);

      return data;
    },
  });

  return mutation;
}
