import * as React from 'react';
import Box from '@mui/material/Box';
import Container from 'components/Container';
import AcceptInvitationForm from 'components/AcceptInvitationForm';

export default function AcceptInvitation() {
  return (
    <Box sx={{ display: 'flex', flex: 1, alignItems: 'center' }}>
      <Container maxWidth="sm">
        <AcceptInvitationForm />
      </Container>
    </Box>
  );
}
