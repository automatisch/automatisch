import { useMutation } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useUpdateConnection() {
  const query = useMutation({
    mutationFn: async ({ connectionId, formattedData, appAuthClientId }) => {
      const { data } = await api.patch(`/v1/connections/${connectionId}`, {
        formattedData,
        appAuthClientId,
      });

      return data;
    },
  });

  return query;
}
