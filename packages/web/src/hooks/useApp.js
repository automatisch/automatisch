import { useQuery } from '@apollo/client';
import { GET_APP } from 'graphql/queries/get-app';
export default function useApp(key) {
  const { data, loading } = useQuery(GET_APP, {
    variables: { key },
  });
  const app = data?.getApp;
  return {
    app,
    loading,
  };
}
