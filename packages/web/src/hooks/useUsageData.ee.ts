import { useQuery } from '@apollo/client';
import { DateTime } from 'luxon';

import { GET_USAGE_DATA } from 'graphql/queries/get-usage-data.ee';

type UseUsageDataReturn = {
  allowedTaskCount: number;
  consumedTaskCount: number;
  remainingTaskCount: number;
  nextResetAt: DateTime;
  loading: boolean;
};

export default function useUsageData(): UseUsageDataReturn {
  const { data, loading } = useQuery(GET_USAGE_DATA);

  const usageData = data?.getUsageData;
  const nextResetAt = usageData?.nextResetAt;
  const nextResetAtDateTimeObject = nextResetAt && DateTime.fromMillis(Number(nextResetAt));

  return {
    allowedTaskCount: usageData?.allowedTaskCount,
    consumedTaskCount: usageData?.consumedTaskCount,
    remainingTaskCount: usageData?.remainingTaskCount,
    nextResetAt: nextResetAtDateTimeObject,
    loading
  };
}
