import { useQuery } from '@apollo/client';
import { DateTime } from 'luxon';
import { TSubscription } from '@automatisch/types';

import { GET_BILLING_AND_USAGE } from 'graphql/queries/get-billing-and-usage.ee';

function transform(billingAndUsageData: NonNullable<UseBillingAndUsageDataReturn>) {
  const nextBillDate = billingAndUsageData.subscription.nextBillDate;
  const nextBillDateTitle = nextBillDate.title;
  const nextBillDateTitleDateObject = DateTime.fromMillis(Number(nextBillDateTitle));
  const formattedNextBillDateTitle = nextBillDateTitleDateObject.isValid ? nextBillDateTitleDateObject.toFormat('LLL dd, yyyy') : nextBillDateTitle;

  return {
    ...billingAndUsageData,
    subscription: {
      ...billingAndUsageData.subscription,
      nextBillDate: {
        ...billingAndUsageData.subscription.nextBillDate,
        title: formattedNextBillDateTitle,
      }
    }
  };
}

type UseBillingAndUsageDataReturn = {
  subscription: TSubscription;
  usage: {
    task: number;
  }
} | null;

export default function useBillingAndUsageData(): UseBillingAndUsageDataReturn {
  const { data, loading } = useQuery(GET_BILLING_AND_USAGE);

  if (loading) return null;

  return transform(data.getBillingAndUsage);
}
