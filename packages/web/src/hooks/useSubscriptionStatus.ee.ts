import { useQuery } from '@apollo/client';
import { DateTime } from 'luxon';

import { GET_SUBSCRIPTION_STATUS } from 'graphql/queries/get-subscription-status.ee';
import useFormatMessage from './useFormatMessage';

type UseSubscriptionStatusReturn = {
  cancellationEffectiveDate: DateTime;
  message: string;
} | null;

export default function useSubscriptionStatus(): UseSubscriptionStatusReturn {
  const formatMessage = useFormatMessage();
  const { data, loading, } = useQuery(GET_SUBSCRIPTION_STATUS);
  const cancellationEffectiveDate = data?.getSubscriptionStatus?.cancellationEffectiveDate as string;
  const hasCancelled = !!cancellationEffectiveDate;

  if (loading || !hasCancelled) return null;

  const cancellationEffectiveDateObject = DateTime.fromMillis(Number(cancellationEffectiveDate)).startOf('day');

  return {
    message: formatMessage(
      'subscriptionCancelledAlert.text',
      {
        date: cancellationEffectiveDateObject.toFormat('DDD')
      }
    ),
    cancellationEffectiveDate: cancellationEffectiveDateObject,
  };
}
