import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';

import * as URLS from 'config/urls';
import ConfirmationDialog from 'components/ConfirmationDialog';
import apolloClient from 'graphql/client';
import { DELETE_CURRENT_USER } from 'graphql/mutations/delete-current-user.ee';
import useAuthentication from 'hooks/useAuthentication';
import useFormatMessage from 'hooks/useFormatMessage';
import useCurrentUser from 'hooks/useCurrentUser';

type DeleteAccountDialogProps = {
  onClose: () => void;
}

export default function DeleteAccountDialog(props: DeleteAccountDialogProps) {
  const [deleteCurrentUser] = useMutation(DELETE_CURRENT_USER);
  const formatMessage = useFormatMessage();
  const currentUser = useCurrentUser();
  const authentication = useAuthentication();
  const navigate = useNavigate();

  const handleConfirm = React.useCallback(async () => {
    await deleteCurrentUser();

    authentication.updateToken('');
    await apolloClient.clearStore();

    navigate(URLS.LOGIN);
  }, [deleteCurrentUser, currentUser]);

  return (
    <ConfirmationDialog
      title={formatMessage('deleteAccountDialog.title')}
      description={formatMessage('deleteAccountDialog.description')}
      onClose={props.onClose}
      onConfirm={handleConfirm}
      cancelButtonChildren={formatMessage('deleteAccountDialog.cancel')}
      confirmButtionChildren={formatMessage('deleteAccountDialog.confirm')}
    />
  );
}
