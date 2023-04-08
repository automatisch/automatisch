import { useQuery } from '@apollo/client';
import { DateTime } from 'luxon';

import { GET_TRIAL_STATUS } from 'graphql/queries/get-trial-status.ee';
import useFormatMessage from './useFormatMessage';

type UseTrialStatusReturn = {
  expireAt: DateTime;
  message: string;
  status: 'error' | 'warning';
} | null;

function getDiffInDays(date: DateTime) {
  const today = DateTime.now().startOf('day');
  const diffInDays = date.diff(today, 'days').days;
  const roundedDiffInDays = Math.round(diffInDays);

  return roundedDiffInDays;
}

function getFeedbackPayload(date: DateTime) {
  const diffInDays = getDiffInDays(date);

  if (diffInDays <= -1) {
    return {
      translationEntryId: 'trialBadge.over',
      status: 'error' as const,
    };
  } else if (diffInDays <= 0) {
    return {
      translationEntryId: 'trialBadge.endsToday',
      status: 'warning' as const,
    }
  } else {
    return {
      translationEntryId: 'trialBadge.xDaysLeft',
      translationEntryValues: {
        remainingDays: diffInDays
      },
      status: 'warning' as const,
    }
  }
}

export default function useTrialStatus(): UseTrialStatusReturn {
  const formatMessage = useFormatMessage();
  const { data, loading } = useQuery(GET_TRIAL_STATUS);

  if (loading || !data.getTrialStatus) return null;

  const expireAt = DateTime.fromMillis(Number(data.getTrialStatus.expireAt)).startOf('day');

  const {
    translationEntryId,
    translationEntryValues,
    status,
  } = getFeedbackPayload(expireAt);

  return {
    message: formatMessage(translationEntryId, translationEntryValues),
    expireAt,
    status
  };
}
