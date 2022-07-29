import * as React from 'react';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import type { IApp } from '@automatisch/types';

import * as URLS from 'config/urls';
import AppIcon from 'components/AppIcon';
import { GET_APPS } from 'graphql/queries/get-apps';
import useFormatMessage from 'hooks/useFormatMessage';

function createConnectionOrFlow(appKey: string, supportsConnections = false) {
  if (!supportsConnections) {
    return URLS.CREATE_FLOW_WITH_APP(appKey);
  }

  return URLS.APP_ADD_CONNECTION(appKey);
};

type AddNewAppConnectionProps = {
  onClose: () => void;
};

export default function AddNewAppConnection(props: AddNewAppConnectionProps): React.ReactElement {
  const { onClose } = props;
  const theme = useTheme();
  const matchSmallScreens = useMediaQuery(theme.breakpoints.down('sm'));
  const formatMessage = useFormatMessage();
  const [appName, setAppName] = React.useState<string | null>(null);
  const { data } = useQuery(GET_APPS, { variables: { name: appName } });

  return (
    <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {formatMessage('apps.addNewAppConnection')}
      </DialogTitle>

      <DialogContent>
        <FormControl
          variant="outlined"
          fullWidth
          size={matchSmallScreens ? 'small' : 'medium'}
        >
          <InputLabel
            htmlFor="search-app"
          >
            {formatMessage('apps.searchApp')}
          </InputLabel>

          <OutlinedInput
            id="search-app"
            type="text"
            fullWidth
            onChange={(event) => setAppName(event.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <SearchIcon sx={{ color: (theme) => theme.palette.primary.main }} />
              </InputAdornment>
            }
            label={formatMessage('apps.searchApp')}
          />
        </FormControl>

        <List sx={{ pt: 2 }}>
          {data?.getApps?.map((app: IApp) => (
            <ListItem disablePadding key={app.name}>
              <ListItemButton component={Link} to={createConnectionOrFlow(app.name.toLowerCase(), app.supportsConnections)}>
                <ListItemIcon sx={{ minWidth: 74 }}>
                  <AppIcon color="transparent" url={app.iconUrl} name={app.name} />
                </ListItemIcon>

                <ListItemText primary={app.name} primaryTypographyProps={{ sx: { color: (theme) => theme.palette.text.primary }  }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
};
