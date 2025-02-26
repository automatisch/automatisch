import { useMutation } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useAdminUpdateTemplate(templateId) {
  const mutation = useMutation({
    mutationFn: async ({ name }) => {
      const { data } = await api.patch(`/v1/admin/templates/${templateId}`, {
        name,
      });

      return data;
    },
  });

  return mutation;
}
