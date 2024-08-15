import { useQuery } from '@tanstack/react-query';
import api from 'helpers/api';

export default function usePaddleInfo() {
  const query = useQuery({
    queryKey: ['payment', 'paddleInfo'],
    queryFn: async ({ signal }) => {
      const { data } = await api.get('/v1/payment/paddle-info', {
        signal,
      });

      return data;
    },
  });

  return query;
}
