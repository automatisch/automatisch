import { useQuery } from '@tanstack/react-query';
import api from 'helpers/api';

export default function useLicense() {
  const query = useQuery({
    queryKey: ['automatisch', 'license'],
    queryFn: async ({ signal }) => {
      const { data } = await api.get('/v1/automatisch/license', { signal });

      return data;
    },
  });

  return query;
}
