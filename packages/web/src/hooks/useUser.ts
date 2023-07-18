import * as React from 'react';
import { useLazyQuery } from '@apollo/client';
import { IUser } from '@automatisch/types';

import { GET_USER } from 'graphql/queries/get-user';

type QueryResponse = {
  getUser: IUser;
}

export default function useUser(userId?: string) {
  const [getUser, { data, loading }] = useLazyQuery<QueryResponse>(GET_USER);

  React.useEffect(() => {
    if (userId) {
      getUser({
        variables: {
          id: userId
        }
      });
    }
  }, [userId]);

  return {
    user: data?.getUser,
    loading
  };
}
