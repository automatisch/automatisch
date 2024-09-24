import { useMutation } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useCreateConnection(appKey) {
  const query = useMutation({
    mutationFn: async ({ appAuthClientId, formattedData }) => {
      const { data } = await api.post(`/v1/apps/${appKey}/connections`, {
        appAuthClientId,
        formattedData,
      });

      return data;
    },
  });

  return query;
}
