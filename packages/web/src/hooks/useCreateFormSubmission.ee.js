import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export default function useCreateFormSubmission(webhookUrl) {
  const mutation = useMutation({
    mutationFn: async (payload) => {
      const response = await axios.post(webhookUrl, payload, {
        maxRedirects: 0,
      });

      const redirectUrl = response.headers['x-redirect-url'];
      if (redirectUrl) {
        return { type: 'redirect', data: redirectUrl };
      }

      const contentType = response.headers['content-type'] || '';
      if (contentType.includes('text/plain')) {
        return { type: 'text', data: response.data };
      }

      return { data: response.data };
    },
  });

  return mutation;
}
