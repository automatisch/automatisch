import PropTypes from 'prop-types';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';

import { getGeneralErrorMessage } from 'helpers/errors';
import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';
import * as React from 'react';
import ConfirmationDialog from 'components/ConfirmationDialog';
import useFormatMessage from 'hooks/useFormatMessage';
import useAdminDeleteApiToken from 'hooks/useAdminDeleteApiToken.ee';

function DeleteApiTokenButton(props) {
  const { apiTokenId } = props;
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const {
    mutateAsync: deleteApiToken,
    error: deleteApiTokenError,
    reset: resetDeleteApiToken,
  } = useAdminDeleteApiToken(apiTokenId);

  const formatMessage = useFormatMessage();
  const enqueueSnackbar = useEnqueueSnackbar();

  const generalErrorMessage = getGeneralErrorMessage({
    error: deleteApiTokenError,
    fallbackMessage: formatMessage('deleteApiTokenButton.deleteError'),
  });

  const handleConfirm = React.useCallback(async () => {
    try {
      await deleteApiToken();
      setShowConfirmation(false);
      enqueueSnackbar(
        formatMessage('deleteApiTokenButton.successfullyDeleted'),
        {
          variant: 'success',
          SnackbarProps: {
            'data-test': 'snackbar-delete-api-token-success',
          },
        },
      );
    } catch (error) {
      console.error(error);
    }
  }, [deleteApiToken]);

  const handleClose = () => {
    setShowConfirmation(false);
    resetDeleteApiToken();
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
        title={formatMessage('deleteApiTokenButton.title')}
        description={formatMessage('deleteApiTokenButton.description')}
        onClose={handleClose}
        onConfirm={handleConfirm}
        cancelButtonChildren={formatMessage('deleteApiTokenButton.cancel')}
        confirmButtonChildren={formatMessage('deleteApiTokenButton.confirm')}
        data-test="delete-api-token-modal"
        errorMessage={generalErrorMessage}
      />
    </>
  );
}

DeleteApiTokenButton.propTypes = {
  apiTokenId: PropTypes.string.isRequired,
};

export default DeleteApiTokenButton;
