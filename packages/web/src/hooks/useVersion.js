import { compare } from 'compare-versions';
import { useQuery } from '@tanstack/react-query';

import useNotifications from 'hooks/useNotifications';
import api from 'helpers/api';

export default function useVersion() {
  const { notifications } = useNotifications();
  const { data } = useQuery({
    queryKey: ['automatischVersion'],
    queryFn: async ({ signal }) => {
      const { data } = await api.get('/v1/automatisch/version', {
        signal,
      });

      return data;
    },
  });
  const version = data?.data?.version;

  const newVersionCount = notifications.reduce((count, notification) => {
    if (!version) return 0;
    // an unexpectedly invalid version would throw and thus, try-catch.
    try {
      const isNewer = compare(version, notification.name, '<');
      return isNewer ? count + 1 : count;
    } catch {
      return count;
    }
  }, 0);

  return {
    version,
    newVersionCount,
  };
}
