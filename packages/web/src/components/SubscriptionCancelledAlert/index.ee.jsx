import * as React from 'react';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';

import useSubscription from 'hooks/useSubscription.ee';

export default function SubscriptionCancelledAlert() {
  const subscription = useSubscription();

  if (!subscription) return <React.Fragment />;

  return (
    <Alert
      severity="warning"
      sx={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Typography variant="subtitle2" sx={{ lineHeight: 1.5 }}>
        {subscription.message}
      </Typography>
    </Alert>
  );
}
