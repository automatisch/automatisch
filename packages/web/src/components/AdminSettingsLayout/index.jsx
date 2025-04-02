import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import GroupIcon from '@mui/icons-material/Group';
import GroupsIcon from '@mui/icons-material/Groups';
import LockIcon from '@mui/icons-material/LockPerson';
import BrushIcon from '@mui/icons-material/Brush';
import AppsIcon from '@mui/icons-material/Apps';
import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import * as React from 'react';

import AppBar from 'components/AppBar';
import Drawer from 'components/Drawer';
import Can from 'components/Can';
import * as URLS from 'config/urls';
import useFormatMessage from 'hooks/useFormatMessage';
import useCurrentUserAbility from 'hooks/useCurrentUserAbility';

import Footer from './Footer';

function createDrawerLinks({
  canCreateFlows,
  canReadRole,
  canReadUser,
  canUpdateConfig,
  canManageSamlAuthProvider,
  canUpdateApp,
}) {
  const items = [
    canReadUser
      ? {
          Icon: GroupIcon,
          primary: 'adminSettingsDrawer.users',
          to: URLS.USERS,
          dataTest: 'users-drawer-link',
        }
      : null,
    canReadRole
      ? {
          Icon: GroupsIcon,
          primary: 'adminSettingsDrawer.roles',
          to: URLS.ROLES,
          dataTest: 'roles-drawer-link',
        }
      : null,
    canUpdateConfig
      ? {
          Icon: BrushIcon,
          primary: 'adminSettingsDrawer.userInterface',
          to: URLS.USER_INTERFACE,
          dataTest: 'user-interface-drawer-link',
        }
      : null,
    canManageSamlAuthProvider
      ? {
          Icon: LockIcon,
          primary: 'adminSettingsDrawer.authentication',
          to: URLS.AUTHENTICATION,
          dataTest: 'authentication-drawer-link',
        }
      : null,
    canUpdateApp
      ? {
          Icon: AppsIcon,
          primary: 'adminSettingsDrawer.apps',
          to: URLS.ADMIN_APPS,
          dataTest: 'apps-drawer-link',
        }
      : null,
    canUpdateConfig
      ? {
          Icon: AppsIcon,
          primary: 'adminSettingsDrawer.templates',
          to: URLS.ADMIN_TEMPLATES,
          dataTest: 'templates-drawer-link',
        }
      : null,
  ].filter(Boolean);

  return items;
}

function SettingsLayout() {
  const theme = useTheme();
  const formatMessage = useFormatMessage();
  const currentUserAbility = useCurrentUserAbility();
  const matchSmallScreens = useMediaQuery(theme.breakpoints.down('lg'));
  const [isDrawerOpen, setDrawerOpen] = React.useState(!matchSmallScreens);
  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  const drawerLinks = createDrawerLinks({
    canCreateFlows: currentUserAbility.can('manage', 'Flow'),
    canReadUser: currentUserAbility.can('read', 'User'),
    canReadRole: currentUserAbility.can('read', 'Role'),
    canUpdateConfig: currentUserAbility.can('manage', 'Config'),
    canManageSamlAuthProvider: currentUserAbility.can(
      'manage',
      'SamlAuthProvider',
    ),
    canUpdateApp: currentUserAbility.can('manage', 'App'),
  });

  const drawerBottomLinks = [
    {
      Icon: ArrowBackIosNewIcon,
      primary: formatMessage('adminSettingsDrawer.goBack'),
      to: '/',
      dataTest: 'go-back-drawer-link',
    },
  ];

  return (
    <Can I="read" a="User">
      <AppBar
        drawerOpen={isDrawerOpen}
        onDrawerOpen={openDrawer}
        onDrawerClose={closeDrawer}
      />

      <Box sx={{ display: 'flex', flex: 1 }}>
        <Drawer
          links={drawerLinks}
          bottomLinks={drawerBottomLinks}
          open={isDrawerOpen}
          onOpen={openDrawer}
          onClose={closeDrawer}
        />

        <Stack sx={{ flex: 1 }}>
          <Toolbar />
          <Outlet />
          <Footer />
        </Stack>
      </Box>
    </Can>
  );
}

export default SettingsLayout;
