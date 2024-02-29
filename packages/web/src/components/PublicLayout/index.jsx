import * as React from 'react';
import Toolbar from '@mui/material/Toolbar';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Logo from 'components/Logo';
import Container from 'components/Container';
export default function Layout({ children }) {
  return (
    <>
      <AppBar>
        <Container maxWidth="lg" disableGutters>
          <Toolbar>
            <Logo />
          </Toolbar>
        </Container>
      </AppBar>

      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Toolbar />

        {children}
      </Box>
    </>
  );
}
