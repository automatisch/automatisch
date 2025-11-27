import * as React from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';

import useFormatMessage from 'hooks/useFormatMessage';

function ShutdownAlert() {
  const formatMessage = useFormatMessage();

  return (
    <Box
      sx={{
        mx: 3,
        my: 2,
      }}
    >
      <Alert severity="error">
        <AlertTitle>{formatMessage('shutdownAlert.title')}</AlertTitle>
        {formatMessage('shutdownAlert.message')}
      </Alert>
    </Box>
  );
}

export default ShutdownAlert;
