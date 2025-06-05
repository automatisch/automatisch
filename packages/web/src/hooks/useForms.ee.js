import { useQuery } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useForms() {
  const query = useQuery({
    queryKey: ['forms'],
    queryFn: async ({ signal }) => {
      const { data } = await api.get('/v1/forms', {
        signal,
      });

      return data;
    },
  });

  return query;
}
