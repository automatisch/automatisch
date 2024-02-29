import { useQuery } from '@apollo/client';
import { GET_PAYMENT_PLANS } from 'graphql/queries/get-payment-plans.ee';
export default function usePaymentPlans() {
  const { data, loading } = useQuery(GET_PAYMENT_PLANS);
  return {
    plans: data?.getPaymentPlans || [],
    loading,
  };
}
