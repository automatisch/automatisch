import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import * as URLS from 'config/urls';
import apolloClient from 'graphql/client';
import { DELETE_USER } from 'graphql/mutations/delete-user.ee';
import useAuthentication from 'hooks/useAuthentication';
import useFormatMessage from 'hooks/useFormatMessage';
import useCurrentUser from 'hooks/useCurrentUser';

type DeleteAccountDialogProps = {
  onClose: () => void;
}

export default function DeleteAccountDialog(props: DeleteAccountDialogProps) {
  const [deleteUser] = useMutation(DELETE_USER);
  const formatMessage = useFormatMessage();
  const currentUser = useCurrentUser();
  const authentication = useAuthentication();
  const navigate = useNavigate();

  const handleConfirm = React.useCallback(async () => {
    await deleteUser();

    authentication.updateToken('');
    await apolloClient.clearStore();

    navigate(URLS.LOGIN);
  }, [deleteUser, currentUser]);

  return (
    <Dialog open onClose={props.onClose}>
      <DialogTitle >
        {formatMessage('deleteAccountDialog.title')}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {formatMessage('deleteAccountDialog.description')}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>{formatMessage('deleteAccountDialog.cancel')}</Button>
        <Button onClick={handleConfirm} color="error">
          {formatMessage('deleteAccountDialog.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
