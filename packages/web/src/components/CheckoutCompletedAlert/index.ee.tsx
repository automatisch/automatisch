import * as React from 'react';
import { useLocation } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';

import useFormatMessage from 'hooks/useFormatMessage';

export default function CheckoutCompletedAlert() {
  const formatMessage = useFormatMessage();
  const location = useLocation();
  const state = location.state as { checkoutCompleted: boolean };

  const checkoutCompleted = state?.checkoutCompleted;

  if (!checkoutCompleted) return <React.Fragment />;

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
