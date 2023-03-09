import { useQuery } from '@apollo/client';
import { GET_PAYMENT_PORTAL_URL } from 'graphql/queries/get-payment-portal-url.ee';

type UsePaymentPortalUrlReturn = {
  url: string;
  loading: boolean;
};

export default function usePaymentPortalUrl(): UsePaymentPortalUrlReturn {
  const { data, loading } = useQuery(GET_PAYMENT_PORTAL_URL);

  return {
    url: data?.getPaymentPortalUrl?.url,
    loading
  };
}
