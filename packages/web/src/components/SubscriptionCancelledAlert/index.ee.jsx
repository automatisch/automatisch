import * as React from 'react';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';

import useSubscription from 'hooks/useSubscription.ee';
import useFormatMessage from 'hooks/useFormatMessage';
import { DateTime } from 'luxon';
import useUserTrial from 'hooks/useUserTrial.ee';

export default function SubscriptionCancelledAlert() {
  const formatMessage = useFormatMessage();
  const subscription = useSubscription();
  const trial = useUserTrial();

  if (subscription?.data?.status === 'active' || trial.hasTrial)
    return <React.Fragment />;

  const cancellationEffectiveDateObject = DateTime.fromISO(
    subscription?.data?.cancellationEffectiveDate,
  );

  return (
    <Alert
      severity="warning"
      sx={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Typography variant="subtitle2" sx={{ lineHeight: 1.5 }}>
        {formatMessage('subscriptionCancelledAlert.text', {
          date: cancellationEffectiveDateObject.toFormat('DDD'),
        })}
      </Typography>
    </Alert>
  );
}
