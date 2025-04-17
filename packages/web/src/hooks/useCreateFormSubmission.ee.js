import { useMutation } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useCreateFormSubmission(formId) {
  const mutation = useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post(`/v1/forms/${formId}`, payload);

      return data;
    },
  });

  return mutation;
}
