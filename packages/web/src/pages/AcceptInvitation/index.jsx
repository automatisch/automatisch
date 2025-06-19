import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from 'components/Container';
import LoginForm from 'components/LoginForm';
import SsoProviders from 'components/SsoProviders/index.ee';


export default function Login(): React.ReactElement {
  return (
    <Box sx={{ display: 'flex', flex: 1, alignItems: 'center' }}>
      <Container maxWidth="sm">
        <Stack direction="column" gap={2}>
          <LoginForm />

          <SsoProviders />
        </Stack>
      </Container>
    </Box>
  );
}
