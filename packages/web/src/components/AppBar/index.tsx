import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import SettingsIcon from '@mui/icons-material/Settings';

import HideOnScroll from 'components/HideOnScroll';
import { FormattedMessage } from 'react-intl';

type AppBarProps = {
  drawerOpen: boolean;
  onDrawerOpen: () => void;
  onDrawerClose: () => void;
};

export default function AppBar({ drawerOpen, onDrawerOpen, onDrawerClose }: AppBarProps) {
  const theme = useTheme();
  const matchSmallScreens = useMediaQuery(theme.breakpoints.down('md'), { noSsr: true });

  return (
    <Box sx={{ flexGrow: 1 }}>
      <HideOnScroll>
        <MuiAppBar>
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
              aria-label="open settings"
            >
              <SettingsIcon />
            </IconButton>
          </Toolbar>
        </MuiAppBar>
      </HideOnScroll>
    </Box>
  );
}
