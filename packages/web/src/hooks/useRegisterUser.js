import { useMutation } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useRegisterUser() {
  const query = useMutation({
    mutationFn: async ({ fullName, email, password }) => {
      const { data } = await api.post(`/v1/users/register`, {
        fullName,
        email,
        password,
      });

      return data;
    },
  });

  return query;
}
