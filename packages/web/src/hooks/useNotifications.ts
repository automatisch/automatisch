import { useQuery } from '@apollo/client';
import type { Notification } from '@automatisch/types';

import { GET_NOTIFICATIONS } from 'graphql/queries/get-notifications';

type UseNotificationsReturn = {
  notifications: Notification[];
  loading: boolean;
}

export default function useNotifications(): UseNotificationsReturn {
  const { data, loading } = useQuery(GET_NOTIFICATIONS);

  const notifications = data?.getNotifications || [];

  return {
    loading,
    notifications,
  };
}
