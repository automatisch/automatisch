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

import * as URLS from 'config/urls';
import AccountDropdownMenu from 'components/AccountDropdownMenu';
import UsageAlert from 'components/UsageAlert/index.ee';
import Container from 'components/Container';
import { FormattedMessage } from 'react-intl';
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

          <div style={{ flexGrow: 1 }}>
            <Link to={URLS.DASHBOARD}>
              <Typography variant="h6" component="h1" noWrap>
                <FormattedMessage id="brandText" />
              </Typography>
            </Link>
          </div>

          <IconButton
            size="large"
            edge="start"
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

      <UsageAlert />

      <AccountDropdownMenu
        anchorEl={accountMenuAnchorElement}
        id={accountMenuId}
        open={isMenuOpen}
        onClose={handleAccountMenuClose}
      />
    </MuiAppBar>
  );
}
