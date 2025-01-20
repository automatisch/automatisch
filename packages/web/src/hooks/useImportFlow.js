import { useMutation } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useImportFlow() {
  const mutation = useMutation({
    mutationFn: async (flowData) => {
      const { data } = await api.post('/v1/flows/import', flowData);

      return data;
    },
  });

  return mutation;
}
