import { useQuery } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useTriggerSubsteps({ appKey, triggerKey }) {
  const query = useQuery({
    queryKey: ['apps', appKey, 'triggers', triggerKey, 'substeps'],
    queryFn: async ({ signal }) => {
      const { data } = await api.get(
        `/v1/apps/${appKey}/triggers/${triggerKey}/substeps`,
        {
          signal,
        },
      );

      return data;
    },
    enabled: !!appKey && !!triggerKey,
  });

  return query;
}
