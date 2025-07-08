import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import GroupIcon from '@mui/icons-material/Group';
import GroupsIcon from '@mui/icons-material/Groups';
import LockIcon from '@mui/icons-material/LockPerson';
import BrushIcon from '@mui/icons-material/Brush';
import AppsIcon from '@mui/icons-material/Apps';
import PinIcon from '@mui/icons-material/Pin';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import * as React from 'react';

import AppBar from 'components/AppBar';
import Drawer from 'components/Drawer';
import * as URLS from 'config/urls';
import useFormatMessage from 'hooks/useFormatMessage';
import useIsCurrentUserAdmin from 'hooks/useIsCurrentUserAdmin';
import useIsCurrentUserEnterpriseAdmin from 'hooks/useIsCurrentUserEnterpriseAdmin';

import Footer from './Footer';

function createDrawerLinks({
  isCurrentUserAdmin,
  isCurrentUserEnterpriseAdmin,
}) {
  const items = [
    isCurrentUserAdmin
      ? {
          Icon: GroupIcon,
          primary: 'adminSettingsDrawer.users',
          to: URLS.USERS,
          dataTest: 'users-drawer-link',
        }
      : null,
    isCurrentUserEnterpriseAdmin
      ? {
          Icon: GroupsIcon,
          primary: 'adminSettingsDrawer.roles',
          to: URLS.ROLES,
          dataTest: 'roles-drawer-link',
        }
      : null,
    isCurrentUserEnterpriseAdmin
      ? {
          Icon: BrushIcon,
          primary: 'adminSettingsDrawer.userInterface',
          to: URLS.USER_INTERFACE,
          dataTest: 'user-interface-drawer-link',
        }
      : null,
    isCurrentUserEnterpriseAdmin
      ? {
          Icon: LockIcon,
          primary: 'adminSettingsDrawer.authentication',
          to: URLS.AUTHENTICATION,
          dataTest: 'authentication-drawer-link',
        }
      : null,
    isCurrentUserEnterpriseAdmin
      ? {
          Icon: AppsIcon,
          primary: 'adminSettingsDrawer.apps',
          to: URLS.ADMIN_APPS,
          dataTest: 'apps-drawer-link',
        }
      : null,
    isCurrentUserEnterpriseAdmin
      ? {
          Icon: ContentCopyIcon,
          primary: 'adminSettingsDrawer.templates',
          to: URLS.ADMIN_TEMPLATES,
          dataTest: 'templates-drawer-link',
        }
      : null,
    isCurrentUserEnterpriseAdmin
      ? {
          Icon: PinIcon,
          primary: 'adminSettingsDrawer.apiTokens',
          to: URLS.ADMIN_API_TOKENS,
          dataTest: 'api-tokens-drawer-link',
        }
      : null,
  ].filter(Boolean);

  return items;
}

function AdminSettingsLayout() {
  const theme = useTheme();
  const formatMessage = useFormatMessage();
  const isCurrentUserAdmin = useIsCurrentUserAdmin();
  const isCurrentUserEnterpriseAdmin = useIsCurrentUserEnterpriseAdmin();
  const matchSmallScreens = useMediaQuery(theme.breakpoints.down('lg'));
  const [isDrawerOpen, setDrawerOpen] = React.useState(!matchSmallScreens);
  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  const drawerLinks = createDrawerLinks({
    isCurrentUserAdmin: isCurrentUserAdmin,
    isCurrentUserEnterpriseAdmin: isCurrentUserEnterpriseAdmin,
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
    <>
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
    </>
  );
}

export default AdminSettingsLayout;
