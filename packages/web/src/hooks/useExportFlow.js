import { useMutation } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useExportFlow(flowId) {
  const mutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.post(`/v1/flows/${flowId}/export`);

      return data;
    },
  });

  return mutation;
}
