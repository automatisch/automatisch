import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import * as URLS from 'config/urls';
import AppIcon from 'components/AppIcon';
import type { App } from 'types/app';
import { GET_APPS } from 'graphql/queries/get-apps';
import useFormatMessage from 'hooks/useFormatMessage';

type AddNewAppConnectionProps = {
  onClose: () => void;
};

export default function AddNewAppConnection(props: AddNewAppConnectionProps){
  const { onClose } = props;
  const formatMessage = useFormatMessage();
  const [appName, setAppName] = useState<string | null>(null);
  const { data } = useQuery(GET_APPS, { variables: {name: appName } });

  return (
    <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{formatMessage('apps.addNewAppConnection')}</DialogTitle>

      <DialogContent>
        <TextField
          fullWidth
          variant="filled"
          label={formatMessage('apps.searchApp')}
          onChange={(event) => setAppName(event.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <List>
          {data?.getApps?.map((app: App) => (
            <ListItem disablePadding key={app.name}>
              <ListItemButton component={Link} to={URLS.APP_ADD_CONNECTION(app.name.toLowerCase())}>
                <ListItemIcon>
                  <AppIcon color={app.primaryColor} url={app.iconUrl} name={app.name} />
                </ListItemIcon>
                <ListItemText primary={app.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
};
