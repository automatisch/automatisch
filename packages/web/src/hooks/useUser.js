import * as React from 'react';
import { useLazyQuery } from '@apollo/client';
import { GET_USER } from 'graphql/queries/get-user';
export default function useUser(userId) {
  const [getUser, { data, loading }] = useLazyQuery(GET_USER);
  React.useEffect(() => {
    if (userId) {
      getUser({
        variables: {
          id: userId,
        },
      });
    }
  }, [userId]);
  return {
    user: data?.getUser,
    loading,
  };
}
