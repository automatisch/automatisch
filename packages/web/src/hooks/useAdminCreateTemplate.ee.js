import { useMutation } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useAdminCreateTemplate() {
  const mutation = useMutation({
    mutationFn: async ({ flowId, name }) => {
      const { data } = await api.post(`/v1/admin/templates`, { flowId, name });

      return data;
    },
  });

  return mutation;
}
