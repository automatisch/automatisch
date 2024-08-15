import { useMutation } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useAdminUserDelete(userId) {
  const mutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.delete(`/v1/admin/users/${userId}`);

      return data;
    },
  });

  return mutation;
}
