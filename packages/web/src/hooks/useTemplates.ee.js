import { useQuery } from '@tanstack/react-query';
import api from 'helpers/api';

export default function useTemplates() {
  const query = useQuery({
    queryKey: ['templates'],
    queryFn: async ({ signal }) => {
      const { data } = await api.get('/v1/templates', {
        signal,
      });

      return data;
    },
  });

  return query;
}
