import { useMutation } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useTestConnection(
  { connectionId },
  { onSettled } = {},
) {
  const query = useMutation({
    mutationFn: async () => {
      const { data } = await api.post(`/v1/connections/${connectionId}/test`);

      return data;
    },
    onSettled,
  });

  return query;
}
