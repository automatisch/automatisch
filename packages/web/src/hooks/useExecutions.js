import { useQuery } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useExecutions(
  { endDateTime, startDateTime, name, page, status },
  { refetchInterval } = {},
) {
  const query = useQuery({
    queryKey: [
      'executions',
      {
        endDateTime,
        startDateTime,
        name,
        page,
        status,
      },
    ],
    queryFn: async ({ signal }) => {
      const { data } = await api.get('/v1/executions', {
        params: {
          endDateTime,
          startDateTime,
          name,
          page,
          status,
        },
        signal,
      });

      return data;
    },
    refetchInterval,
  });

  return query;
}
