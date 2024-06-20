import PropTypes from 'prop-types';
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

function DeleteAccountDialog(props) {
  const [deleteCurrentUser] = useMutation(DELETE_CURRENT_USER);
  const formatMessage = useFormatMessage();
  const { data } = useCurrentUser();
  const currentUser = data?.data;

  const authentication = useAuthentication();
  const navigate = useNavigate();

  const handleConfirm = React.useCallback(async () => {
    await deleteCurrentUser();
    authentication.removeToken();
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
      confirmButtonChildren={formatMessage('deleteAccountDialog.confirm')}
    />
  );
}

DeleteAccountDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default DeleteAccountDialog;
