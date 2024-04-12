import { useQuery } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useActionSubsteps({ appKey, actionKey }) {
  const query = useQuery({
    queryKey: ['apps', appKey, 'actions', actionKey, 'substeps'],
    queryFn: async ({ signal }) => {
      const { data } = await api.get(
        `/v1/apps/${appKey}/actions/${actionKey}/substeps`,
        {
          signal,
        },
      );

      return data;
    },
    enabled: !!appKey && !!actionKey,
  });

  return query;
}
