import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import * as React from 'react';

import { getUnifiedErrorMessage } from 'helpers/errors';
import useFormatMessage from 'hooks/useFormatMessage';
import useUpdateFolder from 'hooks/useUpdateFolder';

export default function EditFolderDialog(props) {
  const { open = true, onClose, folder = {} } = props;

  const [folderName, setFolderName] = React.useState(folder.name);
  const formatMessage = useFormatMessage();

  const {
    mutate: updateFolder,
    error,
    isError,
    isSuccess,
  } = useUpdateFolder(folder.id);

  const handleUpdateFolder = () => {
    updateFolder({ name: folderName });
  };

  const handleTextFieldChange = (event) => {
    setFolderName(event.target.value);
  };

  const handleTextFieldKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleUpdateFolder();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} data-test="edit-folder-dialog">
      <DialogTitle>{formatMessage('editFolderDialog.title')}</DialogTitle>

      <IconButton
        data-test="close-dialog"
        aria-label="close"
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent>
        <DialogContentText>
          {formatMessage('editFolderDialog.description')}
        </DialogContentText>
        <TextField
          data-test="new-folder-name"
          sx={{ mt: 2 }}
          value={folderName}
          onKeyDown={handleTextFieldKeyDown}
          onChange={handleTextFieldChange}
          label={formatMessage('editFolderDialog.folderNameInputLabel')}
          fullWidth
        />
      </DialogContent>

      <DialogActions sx={{ mb: 1 }}>
        <Button
          variant="contained"
          onClick={handleUpdateFolder}
          data-test="edit-folder-dialog-update-button"
          startIcon={<SaveIcon />}
        >
          {formatMessage('editFolderDialog.update')}
        </Button>
      </DialogActions>

      {isError && (
        <Alert
          data-test="edit-folder-dialog-generic-error-alert"
          severity="error"
          sx={{ whiteSpace: 'pre-line' }}
        >
          {getUnifiedErrorMessage(error?.response?.data?.errors) ||
            formatMessage('genericError')}
        </Alert>
      )}

      {isSuccess && (
        <Alert data-test="edit-folder-dialog-success-alert" severity="success">
          {formatMessage('editFolderDialog.successfullyUpdatedFolder')}
        </Alert>
      )}
    </Dialog>
  );
}
