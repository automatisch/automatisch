import * as React from 'react';

import Toolbar from '@mui/material/Toolbar';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import Container from 'components/Container';
import { FormattedMessage } from 'react-intl';

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps): React.ReactElement {
  return (
    <>
      <AppBar>
        <Container maxWidth="lg" disableGutters>
          <Toolbar>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1 }}
            >
              <FormattedMessage id="brandText" />
            </Typography>
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
