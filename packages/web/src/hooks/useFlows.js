import api from 'helpers/api';
import { useQuery } from '@tanstack/react-query';

export default function useFlows({ flowName, page }) {
  const query = useQuery({
    queryKey: ['flows', flowName, { page }],
    queryFn: async ({ signal }) => {
      const { data } = await api.get('/v1/flows', {
        params: { name: flowName, page },
        signal,
      });

      return data;
    },
  });

  return query;
}
