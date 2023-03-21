import * as URLS from 'config/urls';
import useFormatMessage from './useFormatMessage';
import useUsageData from './useUsageData.ee';

type UseUsageAlertReturn = {
  showAlert: true;
  hasExceededLimit: boolean;
  alertMessage: string;
  url: string;
  consumptionPercentage: number;
};

type UseUsageNoAlertReturn = {
  showAlert: false;
};

export default function useUsageAlert(): UseUsageAlertReturn | UseUsageNoAlertReturn {
  const {
    allowedTaskCount,
    consumedTaskCount,
    nextResetAt,
    loading
  } = useUsageData();
  const formatMessage = useFormatMessage();

  if (loading) {
    return { showAlert: false };
  }

  const withinUsageThreshold = consumedTaskCount > allowedTaskCount * 0.7;
  const consumptionPercentage = consumedTaskCount / allowedTaskCount * 100;
  const hasExceededLimit = consumedTaskCount >= allowedTaskCount;

  const alertMessage = formatMessage('usageAlert.informationText', {
    allowedTaskCount,
    consumedTaskCount,
    relativeResetDate: nextResetAt?.toRelative(),
  });

  return {
    showAlert: withinUsageThreshold,
    hasExceededLimit,
    alertMessage,
    consumptionPercentage,
    url: URLS.SETTINGS_PLAN_UPGRADE,
  };
}
