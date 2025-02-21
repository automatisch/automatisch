import { useQuery } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useFolders() {
  const query = useQuery({
    queryKey: ['folders'],
    queryFn: async ({ signal }) => {
      const { data } = await api.get('/v1/folders', {
        signal,
      });

      return data;
    },
  });

  return query;
}
