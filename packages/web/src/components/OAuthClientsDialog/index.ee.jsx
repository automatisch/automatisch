import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import * as React from 'react';
import useOAuthClients from 'hooks/useOAuthClients';
import useFormatMessage from 'hooks/useFormatMessage';

function AppOAuthClientsDialog(props) {
  const { appKey, onClientClick, onClose } = props;
  const { data: appOAuthClients } = useOAuthClients(appKey);

  const formatMessage = useFormatMessage();

  if (!appOAuthClients?.data.length) return <React.Fragment />;

  return (
    <Dialog onClose={onClose} open={true}>
      <DialogTitle>{formatMessage('appOAuthClientsDialog.title')}</DialogTitle>

      <List sx={{ pt: 0 }}>
        {appOAuthClients.data.map((oauthClient) => (
          <ListItem disableGutters key={oauthClient.id}>
            <ListItemButton onClick={() => onClientClick(oauthClient.id)}>
              <ListItemText primary={oauthClient.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}

AppOAuthClientsDialog.propTypes = {
  appKey: PropTypes.string.isRequired,
  onClientClick: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AppOAuthClientsDialog;
