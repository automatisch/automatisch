import { useMutation } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useCreateConnection(appKey) {
  const mutation = useMutation({
    mutationFn: async ({ oauthClientId, formattedData }) => {
      const { data } = await api.post(`/v1/apps/${appKey}/connections`, {
        oauthClientId,
        formattedData,
      });

      return data;
    },
  });

  return mutation;
}
