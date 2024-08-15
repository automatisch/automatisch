import { useQuery } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useRole({ roleId }) {
  const query = useQuery({
    queryKey: ['admin', 'roles', roleId],
    queryFn: async ({ signal }) => {
      const { data } = await api.get(`/v1/admin/roles/${roleId}`, {
        signal,
      });

      return data;
    },
    enabled: !!roleId,
  });

  return query;
}
