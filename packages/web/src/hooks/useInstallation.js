import { useMutation } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useInstallation() {
  const mutation = useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post('/v1/installation/users', payload);

      return data;
    },
  });

  return mutation;
}
