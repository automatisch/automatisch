import { DateTime } from 'luxon';
import { useQuery } from '@tanstack/react-query';

import useFormatMessage from './useFormatMessage';
import api from 'helpers/api';

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

  const { data } = useQuery({
    queryKey: ['users', 'me', 'trial'],
    queryFn: async ({ signal }) => {
      const { data } = await api.get('/v1/users/me/trial', {
        signal,
      });

      return data;
    },
  });

  const userTrial = data?.data;

  const hasTrial = userTrial?.inTrial;

  const expireAt = DateTime.fromISO(userTrial?.expireAt).startOf('day');

  const { translationEntryId, translationEntryValues, status, over } =
    getFeedbackPayload(expireAt);

  return {
    message: formatMessage(translationEntryId, translationEntryValues),
    expireAt,
    over,
    status,
    hasTrial,
  };
}
