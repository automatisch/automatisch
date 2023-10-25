import * as React from 'react';
import { useLazyQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import debounce from 'lodash/debounce';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
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
}

type AddNewAppConnectionProps = {
  onClose: () => void;
};

export default function AddNewAppConnection(
  props: AddNewAppConnectionProps
): React.ReactElement {
  const { onClose } = props;
  const theme = useTheme();
  const matchSmallScreens = useMediaQuery(theme.breakpoints.down('sm'));
  const formatMessage = useFormatMessage();
  const [appName, setAppName] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [getApps, { data }] = useLazyQuery(GET_APPS, {
    onCompleted: () => {
      setLoading(false);
    },
  });

  const fetchData = React.useMemo(
    () => debounce((name) => getApps({ variables: { name } }), 300),
    [getApps]
  );

  React.useEffect(
    function fetchAppsOnAppNameChange() {
      setLoading(true);

      fetchData(appName);
    },
    [fetchData, appName]
  );

  React.useEffect(function cancelDebounceOnUnmount() {
    return () => {
      fetchData.cancel();
    };
  }, []);

  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      data-test="add-app-connection-dialog">
      <DialogTitle>{formatMessage('apps.addNewAppConnection')}</DialogTitle>

      <Box px={3}>
        <FormControl
          variant="outlined"
          fullWidth
          size={matchSmallScreens ? 'small' : 'medium'}
        >
          <InputLabel htmlFor="search-app">
            {formatMessage('apps.searchApp')}
          </InputLabel>

          <OutlinedInput
            id="search-app"
            type="text"
            fullWidth
            autoFocus
            onChange={(event) => setAppName(event.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <SearchIcon
                  sx={{ color: (theme) => theme.palette.primary.main }}
                />
              </InputAdornment>
            }
            label={formatMessage('apps.searchApp')}
            inputProps={{
              'data-test': 'search-for-app-text-field',
            }}
          />
        </FormControl>
      </Box>

      <DialogContent>
        <List sx={{ pt: 2, width: '100%' }}>
          {loading && (
            <CircularProgress
              data-test="search-for-app-loader"
              sx={{ display: 'block', margin: '20px auto' }}
            />
          )}

          {!loading &&
            data?.getApps?.map((app: IApp) => (
              <ListItem disablePadding key={app.name} data-test="app-list-item">
                <ListItemButton
                  component={Link}
                  to={createConnectionOrFlow(app.key, app.supportsConnections)}
                >
                  <ListItemIcon sx={{ minWidth: 74 }}>
                    <AppIcon
                      color="transparent"
                      url={app.iconUrl}
                      name={app.name}
                    />
                  </ListItemIcon>

                  <ListItemText
                    primary={app.name}
                    primaryTypographyProps={{
                      sx: { color: (theme) => theme.palette.text.primary },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
        </List>
      </DialogContent>
    </Dialog>
  );
}
