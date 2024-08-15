import PropTypes from 'prop-types';
import * as React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import PaymentIcon from '@mui/icons-material/Payment';
import * as URLS from 'config/urls';
import useAutomatischInfo from 'hooks/useAutomatischInfo';
import useFormatMessage from 'hooks/useFormatMessage';
import AppBar from 'components/AppBar';
import Drawer from 'components/Drawer';

function createDrawerLinks({ isCloud }) {
  const items = [
    {
      Icon: AccountCircleIcon,
      primary: 'settingsDrawer.myProfile',
      to: URLS.SETTINGS_PROFILE,
    },
  ];
  if (isCloud) {
    items.push({
      Icon: PaymentIcon,
      primary: 'settingsDrawer.billingAndUsage',
      to: URLS.SETTINGS_BILLING_AND_USAGE,
    });
  }
  return items;
}

function SettingsLayout({ children }) {
  const { data: automatischInfo } = useAutomatischInfo();
  const isCloud = automatischInfo?.data.isCloud;
  const theme = useTheme();
  const formatMessage = useFormatMessage();
  const matchSmallScreens = useMediaQuery(theme.breakpoints.down('lg'));
  const [isDrawerOpen, setDrawerOpen] = React.useState(!matchSmallScreens);
  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);
  const drawerLinks = createDrawerLinks({ isCloud });
  const drawerBottomLinks = [
    {
      Icon: ArrowBackIosNewIcon,
      primary: formatMessage('settingsDrawer.goBack'),
      to: '/',
    },
  ];

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

SettingsLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SettingsLayout;
