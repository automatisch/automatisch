import { useQuery } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useCurrentUser() {
  const query = useQuery({
    queryKey: ['users', 'me'],
    queryFn: async ({ signal }) => {
      const { data } = await api.get(`/v1/users/me`, {
        signal,
      });

      return data;
    },
  });

  return query;
}
