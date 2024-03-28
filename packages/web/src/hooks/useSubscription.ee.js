import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { DateTime } from 'luxon';
import * as React from 'react';

import api from 'helpers/api';

function transform(subscription) {
  const nextBillDate = subscription?.nextBillDate;
  const nextBillDateTitleDateObject = DateTime.fromISO(nextBillDate);
  const formattedNextBillDateTitle = nextBillDateTitleDateObject.isValid
    ? nextBillDateTitleDateObject.toFormat('LLL dd, yyyy')
    : nextBillDate;

  return {
    ...subscription,
    nextBillDate: formattedNextBillDateTitle,
  };
}

export default function useSubscription() {
  const location = useLocation();
  const state = location.state;
  const checkoutCompleted = state?.checkoutCompleted;
  const [isPolling, setIsPolling] = React.useState(false);

  const { data, isLoading: isSubscriptionLoading } = useQuery({
    queryKey: ['subscription'],
    queryFn: async ({ signal }) => {
      const { data } = await api.get(`/v1/users/me/subscription`, {
        signal,
      });

      return data;
    },
    refetchInterval: isPolling ? 1000 : false,
  });

  const subscription = data?.data;

  const hasSubscription = !!subscription?.status;

  React.useEffect(
    function pollDataUntilSubscriptionIsCreated() {
      if (checkoutCompleted && !hasSubscription) {
        setIsPolling(true);
      }
    },
    [checkoutCompleted, hasSubscription],
  );

  React.useEffect(
    function stopPollingWhenSubscriptionIsCreated() {
      if (checkoutCompleted && hasSubscription) {
        setIsPolling(false);
      }
    },
    [checkoutCompleted, hasSubscription],
  );

  const cancellationEffectiveDate = subscription?.cancellationEffectiveDate;

  const hasCancelled = !!cancellationEffectiveDate;

  if (isSubscriptionLoading || !hasCancelled) return null;

  return {
    data: transform(subscription),
  };
}
