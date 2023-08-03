import * as React from 'react';
import { useMutation } from '@apollo/client';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSnackbar } from 'notistack';

import ConfirmationDialog from 'components/ConfirmationDialog';
import { DELETE_USER } from 'graphql/mutations/delete-user.ee';
import useFormatMessage from 'hooks/useFormatMessage';

type DeleteUserButtonProps = {
  userId: string;
};

export default function DeleteUserButton(props: DeleteUserButtonProps) {
  const { userId } = props;
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const [deleteUser] = useMutation(DELETE_USER, {
    variables: { input: { id: userId } },
    refetchQueries: ['GetUsers'],
  });
  const formatMessage = useFormatMessage();
  const { enqueueSnackbar } = useSnackbar();

  const handleConfirm = React.useCallback(async () => {
    try {
      await deleteUser();

      setShowConfirmation(false);
      enqueueSnackbar(formatMessage('deleteUserButton.successfullyDeleted'), {
        variant: 'success',
      });
    } catch (error) {
      throw new Error('Failed while deleting!');
    }
  }, [deleteUser]);

  return (
    <>
      <IconButton onClick={() => setShowConfirmation(true)} size="small">
        <DeleteIcon />
      </IconButton>

      <ConfirmationDialog
        open={showConfirmation}
        title={formatMessage('deleteUserButton.title')}
        description={formatMessage('deleteUserButton.description')}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirm}
        cancelButtonChildren={formatMessage('deleteUserButton.cancel')}
        confirmButtionChildren={formatMessage('deleteUserButton.confirm')}
      />
    </>
  );
}
