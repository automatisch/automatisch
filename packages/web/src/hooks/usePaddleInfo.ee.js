import { useQuery } from '@apollo/client';
import { GET_PADDLE_INFO } from 'graphql/queries/get-paddle-info.ee';
export default function usePaddleInfo() {
  const { data, loading } = useQuery(GET_PADDLE_INFO);
  return {
    sandbox: data?.getPaddleInfo?.sandbox,
    vendorId: data?.getPaddleInfo?.vendorId,
    loading,
  };
}
