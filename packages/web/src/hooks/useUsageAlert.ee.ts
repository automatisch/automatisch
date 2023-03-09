import useFormatMessage from './useFormatMessage';
import useUsageData from './useUsageData.ee';
import usePaymentPortalUrl from './usePaymentPortalUrl.ee';

type UseUsageAlertReturn = {
  showAlert: boolean;
  hasExceededLimit?: boolean;
  alertMessage?: string;
  url?: string;
  consumptionPercentage?: number;
};

export default function useUsageAlert(): UseUsageAlertReturn {
  const { url, loading: paymentPortalUrlLoading } = usePaymentPortalUrl();
  const {
    allowedTaskCount,
    consumedTaskCount,
    nextResetAt,
    loading: usageDataLoading
  } = useUsageData();
  const formatMessage = useFormatMessage();

  if (paymentPortalUrlLoading || usageDataLoading) {
    return { showAlert: false };
  }

  const hasLoaded = !paymentPortalUrlLoading || usageDataLoading;
  const withinUsageThreshold = consumedTaskCount > allowedTaskCount * 0.7;
  const consumptionPercentage = consumedTaskCount / allowedTaskCount * 100;
  const showAlert = hasLoaded && withinUsageThreshold;
  const hasExceededLimit = consumedTaskCount >= allowedTaskCount;

  const alertMessage = formatMessage('usageAlert.informationText', {
    allowedTaskCount,
    consumedTaskCount,
    relativeResetDate: nextResetAt?.toRelative(),
  });

  return {
    showAlert,
    hasExceededLimit,
    alertMessage,
    consumptionPercentage,
    url,
  };
}
