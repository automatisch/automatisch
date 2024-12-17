import PropTypes from 'prop-types';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { useQueryClient } from '@tanstack/react-query';

import { getGeneralErrorMessage } from 'helpers/errors';
import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';
import * as React from 'react';
import ConfirmationDialog from 'components/ConfirmationDialog';
import useFormatMessage from 'hooks/useFormatMessage';
import useAdminUserDelete from 'hooks/useAdminUserDelete';

function DeleteUserButton(props) {
  const { userId } = props;
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const {
    mutateAsync: deleteUser,
    error: deleteUserError,
    reset: resetDeleteUser,
  } = useAdminUserDelete(userId);

  const formatMessage = useFormatMessage();
  const enqueueSnackbar = useEnqueueSnackbar();
  const queryClient = useQueryClient();

  const generalErrorMessage = getGeneralErrorMessage({
    error: deleteUserError,
    fallbackMessage: formatMessage('deleteUserButton.deleteError'),
  });

  const handleConfirm = React.useCallback(async () => {
    try {
      await deleteUser();
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      setShowConfirmation(false);
      enqueueSnackbar(formatMessage('deleteUserButton.successfullyDeleted'), {
        variant: 'success',
        SnackbarProps: {
          'data-test': 'snackbar-delete-user-success',
        },
      });
    } catch {}
  }, [deleteUser]);

  const handleClose = () => {
    setShowConfirmation(false);
    resetDeleteUser();
  };

  return (
    <>
      <IconButton
        data-test="delete-button"
        onClick={() => setShowConfirmation(true)}
        size="small"
      >
        <DeleteIcon />
      </IconButton>

      <ConfirmationDialog
        open={showConfirmation}
        title={formatMessage('deleteUserButton.title')}
        description={formatMessage('deleteUserButton.description')}
        onClose={handleClose}
        onConfirm={handleConfirm}
        cancelButtonChildren={formatMessage('deleteUserButton.cancel')}
        confirmButtonChildren={formatMessage('deleteUserButton.confirm')}
        data-test="delete-user-modal"
        errorMessage={generalErrorMessage}
      />
    </>
  );
}

DeleteUserButton.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default DeleteUserButton;
