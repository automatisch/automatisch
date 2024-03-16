import { useQuery } from '@tanstack/react-query';
import { DateTime } from 'luxon';

import useFormatMessage from './useFormatMessage';
import api from 'helpers/api';

export default function useSubscription() {
  const formatMessage = useFormatMessage();

  const { data, isLoading: isSubscriptionLoading } = useQuery({
    queryKey: ['subscription'],
    queryFn: async ({ signal }) => {
      const { data } = await api.get(`/v1/users/me/subscription`, {
        signal,
      });

      return data;
    },
  });
  const subscription = data?.data;

  const cancellationEffectiveDate = subscription?.cancellationEffectiveDate;

  const hasCancelled = !!cancellationEffectiveDate;

  if (isSubscriptionLoading || !hasCancelled) return null;

  const cancellationEffectiveDateObject = DateTime.fromISO(
    cancellationEffectiveDate,
  );

  return {
    message: formatMessage('subscriptionCancelledAlert.text', {
      date: cancellationEffectiveDateObject.toFormat('DDD'),
    }),
    cancellationEffectiveDate: cancellationEffectiveDateObject,
  };
}
