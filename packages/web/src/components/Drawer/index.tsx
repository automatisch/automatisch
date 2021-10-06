import * as React from 'react';
import { DrawerProps } from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AppsIcon from '@mui/icons-material/Apps';
import LanguageIcon from '@mui/icons-material/Language';
import OfflineBoltIcon from '@mui/icons-material/OfflineBolt';


import ListItemLink from 'components/ListItemLink';
import HideOnScroll from 'components/HideOnScroll';
import useFormatMessage from 'hooks/useFormatMessage';
import * as URLS from 'config/urls';
import { Drawer as BaseDrawer } from './style';


export default function Drawer(props: DrawerProps) {
  const formatMessage = useFormatMessage();

  return (
    <BaseDrawer
      {...props}
      variant="permanent"
    >
      <HideOnScroll unmountOnExit>
        <Toolbar />
      </HideOnScroll>

      <List>
        <ListItemLink
          icon={<DashboardIcon />}
          primary={formatMessage('drawer.dashboard')}
          to={URLS.DASHBOARD}
        />

        <ListItemLink
          icon={<OfflineBoltIcon />}
          primary={formatMessage('drawer.flows')}
          to={URLS.FLOWS}
        />

        <ListItemLink
          icon={<AppsIcon />}
          primary={formatMessage('drawer.apps')}
          to={URLS.APPS}
        />

        <ListItemLink
          icon={<LanguageIcon />}
          primary={formatMessage('drawer.explore')}
          to={URLS.EXPLORE}
        />
      </List>

      <Divider />
    </BaseDrawer>
  );
}
