import PropTypes from 'prop-types';
import { useMutation } from '@apollo/client';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';
import * as React from 'react';
import Can from 'components/Can';
import ConfirmationDialog from 'components/ConfirmationDialog';
import { DELETE_ROLE } from 'graphql/mutations/delete-role.ee';
import useFormatMessage from 'hooks/useFormatMessage';

function DeleteRoleButton(props) {
  const { disabled, roleId } = props;
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const [deleteRole] = useMutation(DELETE_ROLE, {
    variables: { input: { id: roleId } },
    refetchQueries: ['GetRoles'],
  });
  const formatMessage = useFormatMessage();
  const enqueueSnackbar = useEnqueueSnackbar();
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
      throw new Error('Failed while deleting!');
    }
  }, [deleteRole]);
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
