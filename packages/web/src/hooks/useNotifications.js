import { useQuery } from '@apollo/client';
import { GET_NOTIFICATIONS } from 'graphql/queries/get-notifications';
export default function useNotifications() {
  const { data, loading } = useQuery(GET_NOTIFICATIONS);
  const notifications = data?.getNotifications || [];
  return {
    loading,
    notifications,
  };
}
