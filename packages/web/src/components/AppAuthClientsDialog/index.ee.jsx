import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import * as React from 'react';
import useAppAuthClients from 'hooks/useAppAuthClients.ee';
import useFormatMessage from 'hooks/useFormatMessage';

function AppAuthClientsDialog(props) {
  const { appKey, onClientClick, onClose } = props;
  const { appAuthClients } = useAppAuthClients({ appKey, active: true });
  const formatMessage = useFormatMessage();
  React.useEffect(
    function autoAuthenticateSingleClient() {
      if (appAuthClients?.length === 1) {
        onClientClick(appAuthClients[0].id);
      }
    },
    [appAuthClients],
  );
  if (!appAuthClients?.length || appAuthClients?.length === 1)
    return <React.Fragment />;
  return (
    <Dialog onClose={onClose} open={true}>
      <DialogTitle>{formatMessage('appAuthClientsDialog.title')}</DialogTitle>

      <List sx={{ pt: 0 }}>
        {appAuthClients.map((appAuthClient) => (
          <ListItem disableGutters key={appAuthClient.id}>
            <ListItemButton onClick={() => onClientClick(appAuthClient.id)}>
              <ListItemText primary={appAuthClient.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}

AppAuthClientsDialog.propTypes = {
  appKey: PropTypes.string.isRequired,
  onClientClick: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AppAuthClientsDialog;
