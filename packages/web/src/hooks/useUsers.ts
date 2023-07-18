import { useQuery } from '@apollo/client';
import { IUser } from '@automatisch/types';

import { GET_USERS } from 'graphql/queries/get-users';

type Edge = {
  node: IUser
}

type QueryResponse = {
  getUsers: {
    pageInfo: {
      currentPage: number;
      totalPages: number;
    }
    edges: Edge[]
  }
}

export default function useUsers() {
  const { data, loading } = useQuery<QueryResponse>(GET_USERS, {
    variables: {
      limit: 100,
      offset: 0
    }
  });
  const users = data?.getUsers.edges.map(({ node }) => node) || [];

  return {
    users,
    loading
  };
}
