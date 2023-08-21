import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import GroupIcon from '@mui/icons-material/Group';
import GroupsIcon from '@mui/icons-material/Groups';
import BrushIcon from '@mui/icons-material/Brush';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import * as React from 'react';

import { SvgIconComponent } from '@mui/icons-material';
import AppBar from 'components/AppBar';
import Drawer from 'components/Drawer';
import * as URLS from 'config/urls';
import useCurrentUserAbility from 'hooks/useCurrentUserAbility';

type SettingsLayoutProps = {
  children: React.ReactNode;
};

type DrawerLink = {
  Icon: SvgIconComponent;
  primary: string;
  to: string;
};

function createDrawerLinks({
  canReadRole,
  canReadUser,
  canUpdateConfig,
}: {
  canReadRole: boolean;
  canReadUser: boolean;
  canUpdateConfig: boolean;
}) {
  const items = [
    canReadUser
      ? {
          Icon: GroupIcon,
          primary: 'adminSettingsDrawer.users',
          to: URLS.USERS,
        }
      : null,
    canReadRole
      ? {
          Icon: GroupsIcon,
          primary: 'adminSettingsDrawer.roles',
          to: URLS.ROLES,
        }
      : null,
    canUpdateConfig
      ? {
          Icon: BrushIcon,
          primary: 'adminSettingsDrawer.userInterface',
          to: URLS.USER_INTERFACE,
        }
      : null,
  ].filter(Boolean) as DrawerLink[];

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
  const theme = useTheme();
  const currentUserAbility = useCurrentUserAbility();
  const matchSmallScreens = useMediaQuery(theme.breakpoints.down('lg'));
  const [isDrawerOpen, setDrawerOpen] = React.useState(!matchSmallScreens);

  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);
  const drawerLinks = createDrawerLinks({
    canReadUser: currentUserAbility.can('read', 'User'),
    canReadRole: currentUserAbility.can('read', 'Role'),
    canUpdateConfig: currentUserAbility.can('update', 'Config'),
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
