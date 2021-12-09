import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';

import HideOnScroll from 'components/HideOnScroll';
import { FormattedMessage } from 'react-intl';

type AppBarProps = {
  onMenuClick: () => void;
};

export default function AppBar({ onMenuClick }: AppBarProps) {
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
              onClick={onMenuClick}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>

            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
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
