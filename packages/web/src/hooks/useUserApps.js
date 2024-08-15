import { useQuery } from '@tanstack/react-query';
import useCurrentUser from 'hooks/useCurrentUser';
import api from 'helpers/api';

export default function useUserApps(appName) {
  const { data } = useCurrentUser();
  const userId = data?.data.id;

  const query = useQuery({
    queryKey: ['users', userId, 'apps', appName],
    queryFn: async ({ signal }) => {
      const { data } = await api.get(`/v1/users/${userId}/apps`, {
        signal,
        params: {
          ...(appName && { name: appName }),
        },
      });

      return data;
    },
    enabled: !!userId,
  });

  return query;
}
