import { useQuery } from '@apollo/client';
import { IUser } from '@automatisch/types';

import { GET_CURRENT_USER } from 'graphql/queries/get-current-user';

export default function useCurrentUser(): IUser {
  const { data } = useQuery(GET_CURRENT_USER);

  return data?.getCurrentUser;
}
