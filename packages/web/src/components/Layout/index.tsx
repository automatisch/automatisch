import * as React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import AppsIcon from '@mui/icons-material/Apps';
import SwapCallsIcon from '@mui/icons-material/SwapCalls';
import HistoryIcon from '@mui/icons-material/History';
import ExploreIcon from '@mui/icons-material/Explore';
import NotificationsIcon from '@mui/icons-material/Notifications';

import * as URLS from 'config/urls';
import AppBar from 'components/AppBar';
import Drawer from 'components/Drawer';

type PublicLayoutProps = {
  children: React.ReactNode;
}

const drawerLinks = [
  {
    Icon: SwapCallsIcon,
    primary: 'drawer.flows',
    to: URLS.FLOWS,
  },
  {
    Icon: AppsIcon,
    primary: 'drawer.apps',
    to: URLS.APPS,
  },
  {
    Icon: HistoryIcon,
    primary: 'drawer.executions',
    to: URLS.EXECUTIONS,
  },
  {
    Icon: ExploreIcon,
    primary: 'drawer.explore',
    to: URLS.EXPLORE,
  },
];

const drawerBottomLinks = [
  {
    Icon: NotificationsIcon,
    primary: 'settingsDrawer.notifications',
    to: URLS.UPDATES,
  },
]

export default function PublicLayout({ children }: PublicLayoutProps): React.ReactElement {
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
          links={drawerLinks}
          bottomLinks={drawerBottomLinks}
          open={isDrawerOpen}
          onOpen={openDrawer}
          onClose={closeDrawer}
        />

        <Box sx={{ flex: 1, }}>
          <Toolbar />

          {children}
        </Box>
      </Box>
    </>
  );
}
