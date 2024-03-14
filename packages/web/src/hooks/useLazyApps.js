import { useMutation } from '@tanstack/react-query';

import api from 'helpers/api';
import React from 'react';

export default function useLazyApps({ appName } = {}, { onSuccess } = {}) {
  const abortControllerRef = React.useRef(new AbortController());

  React.useEffect(() => {
    abortControllerRef.current = new AbortController();

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [appName]);

  const query = useMutation({
    mutationFn: async () => {
      const { data } = await api.get('/v1/apps', {
        params: { name: appName },
        signal: abortControllerRef.current.signal,
      });

      return data;
    },
    onSuccess,
  });

  return query;
}
