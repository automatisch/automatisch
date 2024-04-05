import * as React from 'react';

import api from 'helpers/api';
import { useMutation } from '@tanstack/react-query';

export default function useLazyFlows({ flowName, page }, { onSettled }) {
  const abortControllerRef = React.useRef(new AbortController());

  React.useEffect(() => {
    abortControllerRef.current = new AbortController();

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [flowName]);

  const query = useMutation({
    mutationFn: async () => {
      const { data } = await api.get('/v1/flows', {
        params: { name: flowName, page },
        signal: abortControllerRef.current.signal,
      });

      return data;
    },
    onSettled,
  });

  return query;
}
