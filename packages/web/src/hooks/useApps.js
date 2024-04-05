import { useQuery } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useApps(variables) {
  const trueOnlyVariables =
    variables &&
    Object.fromEntries(
      Object.entries(variables).filter(
        ([key, value]) => value === true || key === 'name',
      ),
    );

  const query = useQuery({
    queryKey: ['apps', trueOnlyVariables],
    queryFn: async ({ signal }) => {
      const { data } = await api.get('/v1/apps', {
        params: trueOnlyVariables,
        signal,
      });

      return data;
    },
  });

  return query;
}
