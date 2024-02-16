import * as React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import AppsIcon from '@mui/icons-material/Apps';
import SwapCallsIcon from '@mui/icons-material/SwapCalls';
import HistoryIcon from '@mui/icons-material/History';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ArrowBackIosNew from '@mui/icons-material/ArrowBackIosNew';

import * as URLS from 'config/urls';
import useFormatMessage from 'hooks/useFormatMessage';
import useVersion from 'hooks/useVersion';
import AppBar from 'components/AppBar';
import Drawer from 'components/Drawer';
import useConfig from 'hooks/useConfig';

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
  disableNotificationsPage: boolean;
  notificationBadgeContent: number;
  additionalDrawerLink?: string;
  additionalDrawerLinkText?: string;
  additionalDrawerLinkIcon?: string;
  formatMessage: ReturnType<typeof useFormatMessage>;
};

const generateDrawerBottomLinks = async ({
  disableNotificationsPage,
  notificationBadgeContent = 0,
  additionalDrawerLink,
  additionalDrawerLinkText,
  formatMessage,
}: GenerateDrawerBottomLinksOptions) => {
  const notificationsPageLinkObject = {
    Icon: NotificationsIcon,
    primary: formatMessage('settingsDrawer.notifications'),
    to: URLS.UPDATES,
    badgeContent: notificationBadgeContent,
  };

  const hasAdditionalDrawerLink =
    additionalDrawerLink && additionalDrawerLinkText;

  const additionalDrawerLinkObject = {
    Icon: ArrowBackIosNew,
    primary: additionalDrawerLinkText || '',
    to: additionalDrawerLink || '',
    target: '_blank' as const,
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

type Link = {
  Icon: React.ElementType;
  primary: string;
  target?: '_blank';
  to: string;
  badgeContent?: React.ReactNode;
};

export default function PublicLayout({
  children,
}: PublicLayoutProps): React.ReactElement {
  const version = useVersion();
  const { config, loading } = useConfig([
    'disableNotificationsPage',
    'additionalDrawerLink',
    'additionalDrawerLinkText',
  ]);
  const theme = useTheme();
  const formatMessage = useFormatMessage();
  const [bottomLinks, setBottomLinks] = React.useState<Link[]>([]);
  const matchSmallScreens = useMediaQuery(theme.breakpoints.down('lg'));
  const [isDrawerOpen, setDrawerOpen] = React.useState(!matchSmallScreens);

  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  React.useEffect(() => {
    async function perform() {
      const newBottomLinks = await generateDrawerBottomLinks({
        notificationBadgeContent: version.newVersionCount,
        disableNotificationsPage: config?.disableNotificationsPage as boolean,
        additionalDrawerLink: config?.additionalDrawerLink as string,
        additionalDrawerLinkText: config?.additionalDrawerLinkText as string,
        formatMessage,
      });

      setBottomLinks(newBottomLinks);
    }

    if (loading) return;

    perform();
  }, [config, loading, version.newVersionCount]);

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
          bottomLinks={bottomLinks}
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
