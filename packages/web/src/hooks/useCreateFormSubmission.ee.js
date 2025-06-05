import { useMutation } from '@tanstack/react-query';

import axios from 'axios';

export default function useCreateFormSubmission(webhookUrl) {
  const mutation = useMutation({
    mutationFn: async (payload) => {
      const { data } = await axios.post(webhookUrl, payload);

      return data;
    },
  });

  return mutation;
}
