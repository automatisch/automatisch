import PropTypes from 'prop-types';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import * as URLS from 'config/urls';
import ConfirmationDialog from 'components/ConfirmationDialog';
import useAuthentication from 'hooks/useAuthentication';
import useFormatMessage from 'hooks/useFormatMessage';
import useCurrentUser from 'hooks/useCurrentUser';
import useDeleteCurrentUser from 'hooks/useDeleteCurrentUser';

function DeleteAccountDialog(props) {
  const formatMessage = useFormatMessage();
  const { data } = useCurrentUser();
  const currentUser = data?.data;

  const { mutateAsync: deleteCurrentUser } = useDeleteCurrentUser(
    currentUser.id,
  );

  const authentication = useAuthentication();
  const navigate = useNavigate();

  const handleConfirm = React.useCallback(async () => {
    await deleteCurrentUser();

    authentication.removeToken();

    navigate(URLS.LOGIN);
  }, [deleteCurrentUser, authentication, navigate]);

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
