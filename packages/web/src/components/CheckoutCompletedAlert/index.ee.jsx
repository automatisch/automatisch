import * as React from 'react';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import useFormatMessage from 'hooks/useFormatMessage';
import useSubscription from 'hooks/useSubscription.ee';

export default function CheckoutCompletedAlert() {
  const formatMessage = useFormatMessage();
  const subscription = useSubscription();

  if (subscription?.data?.status !== 'active') return <React.Fragment />;

  return (
    <Alert
      severity="success"
      sx={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Typography variant="subtitle2" sx={{ lineHeight: 1.5 }}>
        {formatMessage('checkoutCompletedAlert.text')}
      </Typography>
    </Alert>
  );
}
