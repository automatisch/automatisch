import * as React from 'react';
import Box from '@mui/material/Box';

import useCloud from 'hooks/useCloud';
import Container from 'components/Container';
import SignUpForm from 'components/SignUpForm/index.ee';

export default function SignUp(): React.ReactElement {
  useCloud({ redirect: true });

  return (
    <Box sx={{ display: 'flex', flex: 1, alignItems: 'center' }}>
      <Container maxWidth="sm">
        <SignUpForm />
      </Container>
    </Box>
  );
}
