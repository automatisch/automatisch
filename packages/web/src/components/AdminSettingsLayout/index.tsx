import * as React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import GroupIcon from '@mui/icons-material/Group';
import GroupsIcon from '@mui/icons-material/Groups';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

import * as URLS from 'config/urls';
import useAutomatischInfo from 'hooks/useAutomatischInfo';
import AppBar from 'components/AppBar';
import Drawer from 'components/Drawer';

type SettingsLayoutProps = {
  children: React.ReactNode;
};

function createDrawerLinks({ isCloud }: { isCloud: boolean }) {
  const items = [
    {
      Icon: GroupIcon,
      primary: 'adminSettingsDrawer.users',
      to: URLS.USERS,
    },
    {
      Icon: GroupsIcon,
      primary: 'adminSettingsDrawer.roles',
      to: URLS.ROLES,
    }
  ]

  return items;
}

const drawerBottomLinks = [
  {
    Icon: ArrowBackIosNewIcon,
    primary: 'adminSettingsDrawer.goBack',
    to: '/',
  },
];

export default function SettingsLayout({
  children,
}: SettingsLayoutProps): React.ReactElement {
  const { isCloud } = useAutomatischInfo();
  const theme = useTheme();
  const matchSmallScreens = useMediaQuery(theme.breakpoints.down('lg'));
  const [isDrawerOpen, setDrawerOpen] = React.useState(!matchSmallScreens);

  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);
  const drawerLinks = createDrawerLinks({ isCloud });

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
