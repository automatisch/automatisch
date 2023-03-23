import { useQuery } from '@apollo/client';

import { TPaymentPlan } from '@automatisch/types';
import { GET_PAYMENT_PLANS } from 'graphql/queries/get-payment-plans.ee';

type UsePaymentPlansReturn = {
  plans: TPaymentPlan[];
  loading: boolean;
};

export default function usePaymentPlans(): UsePaymentPlansReturn {
  const { data, loading } = useQuery(GET_PAYMENT_PLANS);

  return {
    plans: data?.getPaymentPlans || [],
    loading
  };
}
