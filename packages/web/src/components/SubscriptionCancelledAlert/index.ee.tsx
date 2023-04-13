import * as React from 'react';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';

import useSubscriptionStatus from 'hooks/useSubscriptionStatus.ee';

export default function SubscriptionCancelledAlert() {
  const subscriptionStatus = useSubscriptionStatus();

  if (!subscriptionStatus) return <React.Fragment />;

  return (
    <Alert
      severity="warning"
      sx={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Typography variant="subtitle2" sx={{ lineHeight: 1.5 }}>
        {subscriptionStatus.message}
      </Typography>
    </Alert>
  );
}
