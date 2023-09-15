import { useQuery } from '@apollo/client';
import { compare } from 'compare-versions';

import { HEALTHCHECK } from 'graphql/queries/healthcheck';
import useNotifications from 'hooks/useNotifications';

type TVersionInfo = {
  version: string;
  newVersionCount: number;
};

export default function useVersion(): TVersionInfo {
  const { notifications } = useNotifications();
  const { data } = useQuery(HEALTHCHECK, { fetchPolicy: 'cache-and-network' });
  const version = data?.healthcheck.version;

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
