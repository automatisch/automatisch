import * as React from 'react';
import { useQuery } from '@apollo/client';
import { useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const state = location.state as { checkoutCompleted: boolean };
  const { data, loading, startPolling, stopPolling } = useQuery(GET_BILLING_AND_USAGE);
  const checkoutCompleted = state?.checkoutCompleted;
  const hasSubscription = !!data?.getBillingAndUsage?.subscription?.status;

  React.useEffect(function pollDataUntilSubscriptionIsCreated() {
    if (checkoutCompleted && !hasSubscription) {
      startPolling(1000);
    }
  }, [checkoutCompleted, hasSubscription, startPolling]);

  React.useEffect(function stopPollingWhenSubscriptionIsCreated() {
    if (checkoutCompleted && hasSubscription) {
      stopPolling();
    }
  }, [checkoutCompleted, hasSubscription, stopPolling]);

  if (loading) return null;

  return transform(data.getBillingAndUsage);
}
