import * as React from 'react';
import Typography from '@mui/material/Typography';

import PageTitle from 'components/PageTitle';
import { generateExternalLink } from 'helpers/translation-values';
import usePaymentPortalUrl from 'hooks/usePaymentPortalUrl.ee';
import useFormatMessage from 'hooks/useFormatMessage';

export default function PaymentInformation() {
  const paymentPortal = usePaymentPortalUrl();
  const formatMessage = useFormatMessage();

  return (
    <React.Fragment>
      <PageTitle
        gutterBottom
      >
        {formatMessage('billingAndUsageSettings.paymentInformation')}
      </PageTitle>

      <Typography>
        {formatMessage(
          'billingAndUsageSettings.paymentPortalInformation',
          { link: generateExternalLink(paymentPortal.url) })}
      </Typography>
    </React.Fragment>
  );
}
