import { useQuery } from '@tanstack/react-query';

import api from 'helpers/api';

export default function usePaymentPlans() {
  const query = useQuery({
    queryKey: ['payment', 'plans'],
    queryFn: async ({ signal }) => {
      const { data } = await api.get('/v1/payment/plans', {
        signal,
      });

      return data;
    },
  });

  return query;
}
