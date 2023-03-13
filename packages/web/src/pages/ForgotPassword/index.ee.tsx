import * as React from 'react';
import Box from '@mui/material/Box';

import useCloud from 'hooks/useCloud';
import Container from 'components/Container';
import ForgotPasswordForm from 'components/ForgotPasswordForm/index.ee';

export default function ForgotPassword(): React.ReactElement {
  useCloud({ redirect: true });

  return (
    <Box sx={{ display: 'flex', flex: 1, alignItems: 'center' }}>
      <Container maxWidth="sm">
        <ForgotPasswordForm />
      </Container>
    </Box>
  );
}
