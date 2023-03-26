import { useQuery } from '@apollo/client';
import { DateTime } from 'luxon';
import { TSubscription } from '@automatisch/types';

import { GET_BILLING_AND_USAGE } from 'graphql/queries/get-billing-and-usage.ee';

function transform(billingAndUsageData: NonNullable<UseBillingAndUsageDataReturn>) {
  const nextBillDate = billingAndUsageData.subscription.nextBillDate;
  const nextBillDateTitle = nextBillDate.title;
  const relativeNextBillDateTitle = nextBillDateTitle ? DateTime.fromMillis(Number(nextBillDateTitle)).toFormat('LLL dd, yyyy') as string : '';

  return {
    ...billingAndUsageData,
    subscription: {
      ...billingAndUsageData.subscription,
      nextBillDate: {
        ...billingAndUsageData.subscription.nextBillDate,
        title: relativeNextBillDateTitle,
      }
    }
  };
}

type UseBillingAndUsageDataReturn = {
  subscription: TSubscription,
  usage: {
    task: number;
  }
} | null;

export default function useBillingAndUsageData(): UseBillingAndUsageDataReturn {
  const { data, loading } = useQuery(GET_BILLING_AND_USAGE);

  if (loading) return null;

  return transform(data.getBillingAndUsage);
}
