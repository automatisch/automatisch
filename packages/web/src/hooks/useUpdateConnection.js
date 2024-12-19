import { useMutation } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useUpdateConnection() {
  const query = useMutation({
    mutationFn: async ({ connectionId, formattedData, oauthClientId }) => {
      const { data } = await api.patch(`/v1/connections/${connectionId}`, {
        formattedData,
        oauthClientId,
      });

      return data;
    },
  });

  return query;
}
