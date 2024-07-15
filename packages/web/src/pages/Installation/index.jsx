import * as React from 'react';
import Stack from '@mui/material/Stack';

import Container from 'components/Container';
import InstallationForm from 'components/InstallationForm';

export default function Installation() {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      py={3}
      flex={1}
    >
      <Container maxWidth="sm">
        <InstallationForm />
      </Container>
    </Stack>
  );
}
