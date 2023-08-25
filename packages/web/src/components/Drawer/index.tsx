import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { SwipeableDrawerProps } from '@mui/material/SwipeableDrawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import useMediaQuery from '@mui/material/useMediaQuery';
import Badge from '@mui/material/Badge';

import ListItemLink from 'components/ListItemLink';
import useFormatMessage from 'hooks/useFormatMessage';
import { Drawer as BaseDrawer } from './style';

const iOS =
  typeof navigator !== 'undefined' &&
  /iPad|iPhone|iPod/.test(navigator.userAgent);

type DrawerLink = {
  Icon: React.ElementType;
  primary: string;
  to: string;
  badgeContent?: React.ReactNode;
  dataTest?: string;
};

type DrawerProps = {
  links: DrawerLink[];
  bottomLinks?: DrawerLink[];
} & SwipeableDrawerProps;

export default function Drawer(props: DrawerProps): React.ReactElement {
  const { links = [], bottomLinks = [], ...drawerProps } = props;
  const theme = useTheme();
  const matchSmallScreens = useMediaQuery(theme.breakpoints.down('md'));
  const formatMessage = useFormatMessage();

  const closeOnClick = (event: React.SyntheticEvent) => {
    if (matchSmallScreens) {
      props.onClose(event);
    }
  };

  return (
    <BaseDrawer
      {...drawerProps}
      disableBackdropTransition={!iOS}
      disableDiscovery={iOS}
      variant={matchSmallScreens ? 'temporary' : 'permanent'}
    >
      {/* keep the following encapsulating `div` to have `space-between` children  */}
      <div>
        <Toolbar />

        <List sx={{ py: 0, mt: 3 }}>
          {links.map(({ Icon, primary, to, dataTest }, index) => (
            <ListItemLink
              key={`${to}-${index}`}
              icon={<Icon htmlColor={theme.palette.primary.main} />}
              primary={formatMessage(primary)}
              to={to}
              onClick={closeOnClick}
              data-test={dataTest}
            />
          ))}
        </List>

        <Divider />
      </div>

      <List sx={{ py: 0, mt: 3 }}>
        {bottomLinks.map(
          ({ Icon, badgeContent, primary, to, dataTest }, index) => (
            <ListItemLink
              key={`${to}-${index}`}
              icon={
                <Badge badgeContent={badgeContent} color="secondary" max={99}>
                  <Icon htmlColor={theme.palette.primary.main} />
                </Badge>
              }
              primary={formatMessage(primary)}
              to={to}
              onClick={closeOnClick}
              data-test={dataTest}
            />
          )
        )}
      </List>
    </BaseDrawer>
  );
}
