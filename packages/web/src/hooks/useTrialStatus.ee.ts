import * as React from 'react';
import { useQuery } from '@apollo/client';
import { useLocation } from 'react-router-dom';
import { DateTime } from 'luxon';

import { GET_TRIAL_STATUS } from 'graphql/queries/get-trial-status.ee';
import useFormatMessage from './useFormatMessage';

type UseTrialStatusReturn = {
  expireAt: DateTime;
  message: string;
  over: boolean;
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
      over: true,
    };
  } else if (diffInDays <= 0) {
    return {
      translationEntryId: 'trialBadge.endsToday',
      status: 'warning' as const,
      over: false,
    }
  } else {
    return {
      translationEntryId: 'trialBadge.xDaysLeft',
      translationEntryValues: {
        remainingDays: diffInDays
      },
      status: 'warning' as const,
      over: false,
    }
  }
}

export default function useTrialStatus(): UseTrialStatusReturn {
  const formatMessage = useFormatMessage();
  const location = useLocation();
  const state = location.state as { checkoutCompleted: boolean };
  const checkoutCompleted = state?.checkoutCompleted;
  const { data, loading, startPolling, stopPolling } = useQuery(GET_TRIAL_STATUS);
  const hasTrial = !!data?.getTrialStatus?.expireAt;

  React.useEffect(function pollDataUntilTrialEnds() {
    if (checkoutCompleted && hasTrial) {
      startPolling(1000);
    }
  }, [checkoutCompleted, hasTrial, startPolling]);

  React.useEffect(function stopPollingWhenTrialEnds() {
    if (checkoutCompleted && !hasTrial) {
      stopPolling();
    }
  }, [checkoutCompleted, hasTrial, stopPolling]);

  if (loading || !data.getTrialStatus) return null;

  const expireAt = DateTime.fromMillis(Number(data.getTrialStatus.expireAt)).startOf('day');

  const {
    translationEntryId,
    translationEntryValues,
    status,
    over,
  } = getFeedbackPayload(expireAt);

  return {
    message: formatMessage(translationEntryId, translationEntryValues),
    expireAt,
    over,
    status
  };
}
