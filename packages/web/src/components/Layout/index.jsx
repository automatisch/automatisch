import * as React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Stack from '@mui/material/Stack';
import AppsIcon from '@mui/icons-material/Apps';
import SwapCallsIcon from '@mui/icons-material/SwapCalls';
import HistoryIcon from '@mui/icons-material/History';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PropTypes from 'prop-types';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import SecurityIcon from '@mui/icons-material/Security';
import CallToActionIcon from '@mui/icons-material/CallToAction';

import * as URLS from 'config/urls';
import useFormatMessage from 'hooks/useFormatMessage';
import useVersion from 'hooks/useVersion';
import AppBar from 'components/AppBar';
import Drawer from 'components/Drawer';
import useAutomatischConfig from 'hooks/useAutomatischConfig';
import useAutomatischInfo from 'hooks/useAutomatischInfo';

import Footer from './Footer';

const additionalDrawerLinkIcons = {
  Security: SecurityIcon,
  ArrowBackIosNew: ArrowBackIosNewIcon,
};

const generateDrawerLinks = ({ isEnterprise }) =>
  [
    {
      Icon: SwapCallsIcon,
      primary: 'drawer.flows',
      to: URLS.FLOWS,
      dataTest: 'flows-page-drawer-link',
    },
    isEnterprise && {
      Icon: CallToActionIcon,
      primary: 'drawer.forms',
      to: URLS.FORMS,
      dataTest: 'forms-page-drawer-link',
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
  ].filter(Boolean);

const generateDrawerBottomLinks = ({
  disableNotificationsPage,
  notificationBadgeContent = 0,
  additionalDrawerLink,
  additionalDrawerLinkIcon,
  additionalDrawerLinkText,
  formatMessage,
}) => {
  const notificationsPageLinkObject = {
    Icon: NotificationsIcon,
    primary: formatMessage('settingsDrawer.notifications'),
    to: URLS.UPDATES,
    badgeContent: notificationBadgeContent,
  };

  const hasAdditionalDrawerLink =
    additionalDrawerLink && additionalDrawerLinkText;

  const additionalDrawerLinkObject = {
    Icon:
      additionalDrawerLinkIcons[additionalDrawerLinkIcon] ||
      ArrowBackIosNewIcon,
    primary: additionalDrawerLinkText || '',
    to: additionalDrawerLink || '',
    target: '_blank',
  };

  const links = [];

  if (!disableNotificationsPage) {
    links.push(notificationsPageLinkObject);
  }

  if (hasAdditionalDrawerLink) {
    links.push(additionalDrawerLinkObject);
  }

  return links;
};

function PublicLayout({ children }) {
  const version = useVersion();
  const { data: automatischInfoData } = useAutomatischInfo();
  const { data: configData } = useAutomatischConfig();

  const automatischInfo = automatischInfoData?.data;
  const config = configData?.data;

  const theme = useTheme();
  const formatMessage = useFormatMessage();
  const matchSmallScreens = useMediaQuery(theme.breakpoints.down('lg'));
  const [isDrawerOpen, setDrawerOpen] = React.useState(!matchSmallScreens);
  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  const bottomLinks = React.useMemo(() => {
    return generateDrawerBottomLinks({
      notificationBadgeContent: version.newVersionCount,
      disableNotificationsPage: config?.disableNotificationsPage,
      additionalDrawerLink: config?.additionalDrawerLink,
      additionalDrawerLinkIcon: config?.additionalDrawerLinkIcon,
      additionalDrawerLinkText: config?.additionalDrawerLinkText,
      formatMessage,
    });
  }, [formatMessage, config, version.newVersionCount]);

  const drawerLinks = React.useMemo(() => {
    return generateDrawerLinks({
      isEnterprise: automatischInfo?.isEnterprise,
    });
  }, [automatischInfo?.isEnterprise]);

  return (
    <>
      <AppBar
        drawerOpen={isDrawerOpen}
        onDrawerOpen={openDrawer}
        onDrawerClose={closeDrawer}
      />

      <Box
        sx={{
          display: 'flex',
          flex: 1,
        }}
      >
        <Drawer
          links={drawerLinks}
          bottomLinks={bottomLinks}
          open={isDrawerOpen}
          onOpen={openDrawer}
          onClose={closeDrawer}
        />

        <Stack flex={1}>
          <Toolbar />
          {children}
          <Footer />
        </Stack>
      </Box>
    </>
  );
}

PublicLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PublicLayout;
