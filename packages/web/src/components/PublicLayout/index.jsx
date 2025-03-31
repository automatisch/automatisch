import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';

function Layout({ children }) {
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}
      >
        {children}
      </Box>
    </>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
