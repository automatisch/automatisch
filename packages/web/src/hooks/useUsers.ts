import { useQuery } from '@apollo/client';
import { IUser } from '@automatisch/types';

import { GET_USERS } from 'graphql/queries/get-users';

type Edge = {
  node: IUser;
};

type QueryResponse = {
  getUsers: {
    pageInfo: {
      currentPage: number;
      totalPages: number;
    };
    totalCount: number;
    edges: Edge[];
  };
};

const getLimitAndOffset = (page: number, rowsPerPage: number) => ({
  limit: rowsPerPage,
  offset: page * rowsPerPage,
});

export default function useUsers(page: number, rowsPerPage: number) {
  const { data, loading } = useQuery<QueryResponse>(GET_USERS, {
    variables: getLimitAndOffset(page, rowsPerPage),
  });
  const users = data?.getUsers.edges.map(({ node }) => node) || [];
  const pageInfo = data?.getUsers.pageInfo;
  const totalCount = data?.getUsers.totalCount;

  return {
    users,
    pageInfo,
    totalCount,
    loading,
  };
}
