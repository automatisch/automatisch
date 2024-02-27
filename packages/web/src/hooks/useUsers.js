import { useQuery } from '@apollo/client';
import { GET_USERS } from 'graphql/queries/get-users';
const getLimitAndOffset = (page, rowsPerPage) => ({
  limit: rowsPerPage,
  offset: page * rowsPerPage,
});
export default function useUsers(page, rowsPerPage) {
  const { data, loading } = useQuery(GET_USERS, {
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
