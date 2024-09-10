import PropTypes from 'prop-types';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';
import * as React from 'react';

import Can from 'components/Can';
import ConfirmationDialog from 'components/ConfirmationDialog';
import useFormatMessage from 'hooks/useFormatMessage';
import useAdminDeleteRole from 'hooks/useAdminDeleteRole';

function DeleteRoleButton(props) {
  const { disabled, roleId } = props;
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const formatMessage = useFormatMessage();
  const enqueueSnackbar = useEnqueueSnackbar();

  const { mutateAsync: deleteRole } = useAdminDeleteRole(roleId);

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
    } catch (error) {
      const errors = Object.values(
        error.response.data.errors || [['Failed while deleting!']],
      );

      for (const [error] of errors) {
        enqueueSnackbar(error, {
          variant: 'error',
          SnackbarProps: {
            'data-test': 'snackbar-delete-role-error',
          },
        });
      }

      throw new Error('Failed while deleting!');
    }
  }, [deleteRole, enqueueSnackbar, formatMessage]);

  return (
    <>
      <Can I="delete" a="Role" passThrough>
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
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirm}
        cancelButtonChildren={formatMessage('deleteRoleButton.cancel')}
        confirmButtonChildren={formatMessage('deleteRoleButton.confirm')}
        data-test="delete-role-modal"
      />
    </>
  );
}

DeleteRoleButton.propTypes = {
  disabled: PropTypes.bool,
  roleId: PropTypes.string.isRequired,
};

export default DeleteRoleButton;
