import { useQuery } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useInvoices() {
  const query = useQuery({
    queryKey: ['users', 'invoices'],
    queryFn: async ({ signal }) => {
      const { data } = await api.get('/v1/users/invoices', {
        signal,
      });

      return data;
    },
  });

  return query;
}
