import { useMutation } from '@tanstack/react-query';

import api from 'helpers/api';

export default function useLazyApps({
  appName,
  onSuccess,
  abortControllerRef,
}) {
  const query = useMutation({
    mutationFn: async ({ payload, signal }) => {
      abortControllerRef.current = new AbortController();

      const { data } = await api.get('/v1/apps', {
        params: { name: appName },
        signal: abortControllerRef.current.signal,
      });

      if (abortControllerRef.current.signal.aborted) {
        return;
      }

      return data;
    },
    onSuccess,
  });

  return query;
}
