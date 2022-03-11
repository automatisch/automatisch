import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { SwipeableDrawerProps } from '@mui/material/SwipeableDrawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppsIcon from '@mui/icons-material/Apps';
import SwapCallsIcon from '@mui/icons-material/SwapCalls';
import HistoryIcon from '@mui/icons-material/History';
import ExploreIcon from '@mui/icons-material/Explore';
import useMediaQuery from '@mui/material/useMediaQuery';

import ListItemLink from 'components/ListItemLink';
import HideOnScroll from 'components/HideOnScroll';
import useFormatMessage from 'hooks/useFormatMessage';
import * as URLS from 'config/urls';
import { Drawer as BaseDrawer } from './style';

const iOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

export default function Drawer(props: SwipeableDrawerProps): React.ReactElement {
  const theme = useTheme();
  const matchSmallScreens = useMediaQuery(theme.breakpoints.down('md'), { noSsr: true });
  const formatMessage = useFormatMessage();

  const closeOnClick = (event: React.SyntheticEvent) => {
    if (matchSmallScreens) {
      props.onClose(event);
    }
  }

  return (
    <BaseDrawer
      {...props}
      disableBackdropTransition={!iOS}
      disableDiscovery={iOS}
      variant={matchSmallScreens ? 'temporary' : 'permanent'}
    >
      <HideOnScroll unmountOnExit>
        <Toolbar />
      </HideOnScroll>

      <List sx={{ py: 0, mt: 3 }}>
        <ListItemLink
          icon={<SwapCallsIcon htmlColor={theme.palette.primary.main} />}
          primary={formatMessage('drawer.flows')}
          to={URLS.FLOWS}
          onClick={closeOnClick}
        />

        <ListItemLink
          icon={<AppsIcon htmlColor={theme.palette.primary.main} />}
          primary={formatMessage('drawer.apps')}
          to={URLS.APPS}
          onClick={closeOnClick}
        />

        <ListItemLink
          icon={<HistoryIcon htmlColor={theme.palette.primary.main} />}
          primary={formatMessage('drawer.executions')}
          to={URLS.EXECUTIONS}
          onClick={closeOnClick}
        />

        <ListItemLink
          icon={<ExploreIcon htmlColor={theme.palette.primary.main} />}
          primary={formatMessage('drawer.explore')}
          to={URLS.EXPLORE}
          onClick={closeOnClick}
        />
      </List>

      <Divider />
    </BaseDrawer>
  );
}
