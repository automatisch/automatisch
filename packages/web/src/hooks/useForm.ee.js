import { useQuery } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useForm(formId) {
  const query = useQuery({
    queryKey: ['forms', formId],
    queryFn: async ({ signal }) => {
      const { data } = await api.get(`/v1/forms/${formId}`, {
        signal,
      });

      return data;
    },
    enabled: !!formId,
  });

  return query;
}
