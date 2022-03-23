import * as React from 'react';
import type { ContainerProps } from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import AccountDropdownMenu from 'components/AccountDropdownMenu';
import Container from 'components/Container';
import HideOnScroll from 'components/HideOnScroll';
import { FormattedMessage } from 'react-intl';

type AppBarProps = {
  drawerOpen: boolean;
  onDrawerOpen: () => void;
  onDrawerClose: () => void;
  maxWidth?: ContainerProps["maxWidth"];
};

const accountMenuId = 'account-menu';

export default function AppBar(props: AppBarProps): React.ReactElement {
  const {
    drawerOpen,
    onDrawerOpen,
    onDrawerClose,
    maxWidth = false,
  } = props;

  const theme = useTheme();
  const matchSmallScreens = useMediaQuery(theme.breakpoints.down('md'), { noSsr: true });

  const [accountMenuAnchorElement, setAccountMenuAnchorElement] = React.useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(accountMenuAnchorElement);

  const handleAccountMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAccountMenuAnchorElement(event.currentTarget);
  };

  const handleAccountMenuClose = () => {
    setAccountMenuAnchorElement(null);
  };

  return (
    <HideOnScroll>
      <MuiAppBar>
        <Container maxWidth={maxWidth} disableGutters>
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={drawerOpen ? onDrawerClose : onDrawerOpen}
              sx={{ mr: 2 }}
            >
              {drawerOpen && matchSmallScreens ? <MenuOpenIcon /> : <MenuIcon />}
            </IconButton>

            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1 }}
            >
              <FormattedMessage id="brandText" />
            </Typography>

            <IconButton
              size="large"
              edge="start"
              color="inherit"
              onClick={handleAccountMenuOpen}
              aria-controls={accountMenuId}
              aria-label="open profile menu"
            >
              <AccountCircleIcon />
            </IconButton>
          </Toolbar>
        </Container>

        <AccountDropdownMenu
          anchorEl={accountMenuAnchorElement}
          id={accountMenuId}
          open={isMenuOpen}
          onClose={handleAccountMenuClose}
        />
      </MuiAppBar>
    </HideOnScroll>
  );
}
