import MenuIcon from '@mui/icons-material/Menu';
import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import HideOnScroll from 'components/HideOnScroll';
import SearchInput from 'components/SearchInput';
import { FormattedMessage } from 'react-intl';

type AppBarProps = {
  onMenuClick: () => void;
};

export default function AppBar({ onMenuClick }: AppBarProps) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <HideOnScroll>
        <MuiAppBar sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={onMenuClick}
              sx={{ mr: 2 }}
            >
              {/* TODO: make Drawer in Layout togglable. */}
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

            <SearchInput />
          </Toolbar>
        </MuiAppBar>
      </HideOnScroll>
    </Box>
  );
}
