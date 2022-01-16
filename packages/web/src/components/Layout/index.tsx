import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import Box from '@mui/material/Box';
import AppBar from 'components/AppBar';
import Drawer from 'components/Drawer';
import Toolbar from '@mui/material/Toolbar';

type LayoutProps = {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.ReactElement {
  const theme = useTheme();
  const matchSmallScreens = useMediaQuery(theme.breakpoints.down('lg'), { noSsr: true });
  const [isDrawerOpen, setDrawerOpen] = React.useState(!matchSmallScreens);

  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  return (
    <>
      <AppBar drawerOpen={isDrawerOpen} onDrawerOpen={openDrawer} onDrawerClose={closeDrawer} />

      <Box sx={{ display: 'flex', }}>
        <Drawer
          open={isDrawerOpen}
          onOpen={openDrawer}
          onClose={closeDrawer}
        />

        <Box sx={{ flex: 1 }}>
          <Toolbar />

          {children}
        </Box>
      </Box>
    </>
  );
}
