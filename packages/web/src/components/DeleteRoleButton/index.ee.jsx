import PropTypes from 'prop-types';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';
import * as React from 'react';

import { getGeneralErrorMessage, getFieldErrorMessage } from 'helpers/errors';
import Can from 'components/Can';
import ConfirmationDialog from 'components/ConfirmationDialog';
import useFormatMessage from 'hooks/useFormatMessage';
import useAdminDeleteRole from 'hooks/useAdminDeleteRole';

function DeleteRoleButton(props) {
  const { disabled, roleId } = props;
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const formatMessage = useFormatMessage();
  const enqueueSnackbar = useEnqueueSnackbar();

  const {
    mutateAsync: deleteRole,
    error: deleteRoleError,
    reset: resetDeleteRole,
  } = useAdminDeleteRole(roleId);

  const roleErrorMessage = getFieldErrorMessage({
    fieldName: 'role',
    error: deleteRoleError,
  });

  const generalErrorMessage = getGeneralErrorMessage({
    error: deleteRoleError,
    fallbackMessage: formatMessage('deleteRoleButton.generalError'),
  });

  const handleConfirm = React.useCallback(async () => {
    try {
      await deleteRole();

      setShowConfirmation(false);
      enqueueSnackbar(formatMessage('deleteRoleButton.successfullyDeleted'), {
        variant: 'success',
        SnackbarProps: {
          'data-test': 'snackbar-delete-role-success',
        },
      });
    } catch {}
  }, [deleteRole, enqueueSnackbar, formatMessage]);

  const handleClose = () => {
    setShowConfirmation(false);
    resetDeleteRole();
  };

  return (
    <>
      <Can I="manage" a="Role" passThrough>
        {(allowed) => (
          <IconButton
            disabled={!allowed || disabled}
            onClick={() => setShowConfirmation(true)}
            size="small"
            data-test="role-delete"
          >
            <DeleteIcon />
          </IconButton>
        )}
      </Can>

      <ConfirmationDialog
        open={showConfirmation}
        title={formatMessage('deleteRoleButton.title')}
        description={formatMessage('deleteRoleButton.description')}
        onClose={handleClose}
        onConfirm={handleConfirm}
        cancelButtonChildren={formatMessage('deleteRoleButton.cancel')}
        confirmButtonChildren={formatMessage('deleteRoleButton.confirm')}
        data-test="delete-role-modal"
        errorMessage={roleErrorMessage || generalErrorMessage}
      />
    </>
  );
}

DeleteRoleButton.propTypes = {
  disabled: PropTypes.bool,
  roleId: PropTypes.string.isRequired,
};

export default DeleteRoleButton;
