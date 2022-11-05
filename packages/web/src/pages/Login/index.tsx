import * as React from 'react';
import Box from '@mui/material/Box';
import Container from 'components/Container';
import LoginForm from 'components/LoginForm';

export default function Login(): React.ReactElement {
  return (
    <Box sx={{ display: 'flex', flex: 1, alignItems: 'center' }}>
      <Container maxWidth="sm">
        <LoginForm />
      </Container>
    </Box>
  );
}
