import * as React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import AppsIcon from '@mui/icons-material/Apps';
import SwapCallsIcon from '@mui/icons-material/SwapCalls';
import HistoryIcon from '@mui/icons-material/History';
import NotificationsIcon from '@mui/icons-material/Notifications';

import * as URLS from 'config/urls';
import useVersion from 'hooks/useVersion';
import AppBar from 'components/AppBar';
import Drawer from 'components/Drawer';
import useAutomatischInfo from 'hooks/useAutomatischInfo';

type PublicLayoutProps = {
  children: React.ReactNode;
};

const drawerLinks = [
  {
    Icon: SwapCallsIcon,
    primary: 'drawer.flows',
    to: URLS.FLOWS,
    dataTest: 'flows-page-drawer-link',
  },
  {
    Icon: AppsIcon,
    primary: 'drawer.apps',
    to: URLS.APPS,
    dataTest: 'apps-page-drawer-link',
  },
  {
    Icon: HistoryIcon,
    primary: 'drawer.executions',
    to: URLS.EXECUTIONS,
    dataTest: 'executions-page-drawer-link',
  },
];

type GenerateDrawerBottomLinksOptions = {
  isMation: boolean;
  loading: boolean;
  notificationBadgeContent: number;
};

const generateDrawerBottomLinks = ({
  isMation,
  loading,
  notificationBadgeContent = 0,
}: GenerateDrawerBottomLinksOptions) => {
  if (loading || isMation) {
    return [];
  }

  return [
    {
      Icon: NotificationsIcon,
      primary: 'settingsDrawer.notifications',
      to: URLS.UPDATES,
      badgeContent: notificationBadgeContent,
    },
  ];
};

export default function PublicLayout({
  children,
}: PublicLayoutProps): React.ReactElement {
  const version = useVersion();
  const { isMation, loading } = useAutomatischInfo();
  const theme = useTheme();
  const matchSmallScreens = useMediaQuery(theme.breakpoints.down('lg'));
  const [isDrawerOpen, setDrawerOpen] = React.useState(!matchSmallScreens);

  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  const drawerBottomLinks = generateDrawerBottomLinks({
    notificationBadgeContent: version.newVersionCount,
    loading,
    isMation,
  });

  return (
    <>
      <AppBar
        drawerOpen={isDrawerOpen}
        onDrawerOpen={openDrawer}
        onDrawerClose={closeDrawer}
      />

      <Box sx={{ display: 'flex' }}>
        <Drawer
          links={drawerLinks}
          bottomLinks={drawerBottomLinks}
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
