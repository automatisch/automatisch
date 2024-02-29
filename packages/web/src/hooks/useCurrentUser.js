import { useQuery } from '@apollo/client';
import { GET_CURRENT_USER } from 'graphql/queries/get-current-user';
export default function useCurrentUser() {
  const { data } = useQuery(GET_CURRENT_USER);
  return data?.getCurrentUser;
}
