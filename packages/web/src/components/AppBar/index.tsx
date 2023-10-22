import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MuiAppBar from '@mui/material/AppBar';
import type { ContainerProps } from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import * as React from 'react';

import AccountDropdownMenu from 'components/AccountDropdownMenu';
import Container from 'components/Container';
import Logo from 'components/Logo/index';
import TrialStatusBadge from 'components/TrialStatusBadge/index.ee';
import * as URLS from 'config/urls';

import { Link } from './style';

type AppBarProps = {
  drawerOpen: boolean;
  onDrawerOpen: () => void;
  onDrawerClose: () => void;
  maxWidth?: ContainerProps['maxWidth'];
};

const accountMenuId = 'account-menu';

export default function AppBar(props: AppBarProps): React.ReactElement {
  const { drawerOpen, onDrawerOpen, onDrawerClose, maxWidth = false } = props;

  const theme = useTheme();
  const matchSmallScreens = useMediaQuery(theme.breakpoints.down('md'));

  const [accountMenuAnchorElement, setAccountMenuAnchorElement] =
    React.useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(accountMenuAnchorElement);

  const handleAccountMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAccountMenuAnchorElement(event.currentTarget);
  };

  const handleAccountMenuClose = () => {
    setAccountMenuAnchorElement(null);
  };

  return (
    <MuiAppBar data-test="app-bar">
      <Container maxWidth={maxWidth} disableGutters>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={drawerOpen ? onDrawerClose : onDrawerOpen}
            sx={{ mr: 2 }}
            data-test="drawer-menu-button"
          >
            {drawerOpen && matchSmallScreens ? <MenuOpenIcon /> : <MenuIcon />}
          </IconButton>

          <div style={{ flexGrow: 1, display: 'flex' }}>
            <Link to={URLS.DASHBOARD}>
              <Logo />
            </Link>
          </div>

          <TrialStatusBadge />

          <IconButton
            size="large"
            color="inherit"
            onClick={handleAccountMenuOpen}
            aria-controls={accountMenuId}
            aria-label="open profile menu"
            data-test="profile-menu-button"
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
  );
}
