import * as React from 'react';
import PropTypes from 'prop-types';
import Toolbar from '@mui/material/Toolbar';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Logo from 'components/Logo';
import Container from 'components/Container';

function Layout({ children }) {
  return (
    <>
      <AppBar>
        <Container maxWidth="lg" disableGutters>
          <Toolbar>
            <Logo />
          </Toolbar>
        </Container>
      </AppBar>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
