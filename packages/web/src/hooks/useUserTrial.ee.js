import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { DateTime } from 'luxon';

import useFormatMessage from './useFormatMessage';
import api from 'helpers/api';
import { useQuery } from '@tanstack/react-query';

function getDiffInDays(date) {
  const today = DateTime.now().startOf('day');
  const diffInDays = date.diff(today, 'days').days;
  const roundedDiffInDays = Math.round(diffInDays);

  return roundedDiffInDays;
}
function getFeedbackPayload(date) {
  const diffInDays = getDiffInDays(date);

  if (diffInDays <= -1) {
    return {
      translationEntryId: 'trialBadge.over',
      status: 'error',
      over: true,
    };
  } else if (diffInDays <= 0) {
    return {
      translationEntryId: 'trialBadge.endsToday',
      status: 'warning',
      over: false,
    };
  } else {
    return {
      translationEntryId: 'trialBadge.xDaysLeft',
      translationEntryValues: {
        remainingDays: diffInDays,
      },
      status: 'warning',
      over: false,
    };
  }
}
export default function useUserTrial() {
  const formatMessage = useFormatMessage();
  const location = useLocation();
  const state = location.state;
  const checkoutCompleted = state?.checkoutCompleted;
  const [isPolling, setIsPolling] = React.useState(false);

  const { data, isLoading: isUserTrialLoading } = useQuery({
    queryKey: ['userTrial'],
    queryFn: async ({ signal }) => {
      const { data } = await api.get('/v1/users/me/trial', {
        signal,
      });

      return data;
    },
    refetchInterval: isPolling ? 1000 : false,
  });
  const userTrial = data?.data;

  const hasTrial = userTrial?.inTrial;

  React.useEffect(
    function pollDataUntilTrialEnds() {
      if (checkoutCompleted && hasTrial) {
        setIsPolling(true);
      }
    },
    [checkoutCompleted, hasTrial, setIsPolling],
  );

  React.useEffect(
    function stopPollingWhenTrialEnds() {
      if (checkoutCompleted && !hasTrial) {
        setIsPolling(false);
      }
    },
    [checkoutCompleted, hasTrial, setIsPolling],
  );

  if (isUserTrialLoading || !hasTrial) return null;

  const expireAt = DateTime.fromISO(userTrial?.expireAt).startOf('day');

  const { translationEntryId, translationEntryValues, status, over } =
    getFeedbackPayload(expireAt);

  return {
    message: formatMessage(translationEntryId, translationEntryValues),
    expireAt,
    over,
    status,
  };
}
