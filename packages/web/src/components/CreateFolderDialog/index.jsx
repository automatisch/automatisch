import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
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
import useCreateFolder from 'hooks/useCreateFolder';
import useFormatMessage from 'hooks/useFormatMessage';

export default function CreateFolderDialog(props) {
  const { open = true, onClose } = props;

  const [folderName, setFolderName] = React.useState('');
  const formatMessage = useFormatMessage();

  const { mutate: createFolder, error, isError, isSuccess } = useCreateFolder();

  const handleCreateFolder = () => {
    createFolder({ name: folderName });

    setFolderName('');
  };

  const handleTextFieldChange = (event) => {
    setFolderName(event.target.value);
  };

  const handleTextFieldKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleCreateFolder();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} data-test="create-folder-dialog">
      <DialogTitle>{formatMessage('createFolderDialog.title')}</DialogTitle>

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
          {formatMessage('createFolderDialog.description')}
        </DialogContentText>
        <TextField
          data-test="new-folder-name"
          sx={{ mt: 2 }}
          value={folderName}
          onKeyDown={handleTextFieldKeyDown}
          onChange={handleTextFieldChange}
          label={formatMessage('createFolderDialog.folderNameInputLabel')}
          fullWidth
        />
      </DialogContent>

      <DialogActions sx={{ mb: 1 }}>
        <Button
          variant="contained"
          onClick={handleCreateFolder}
          data-test="create-folder-dialog-create-button"
          startIcon={<AddIcon />}
        >
          {formatMessage('createFolderDialog.create')}
        </Button>
      </DialogActions>

      {isError && (
        <Alert
          data-test="create-folder-dialog-generic-error-alert"
          severity="error"
          sx={{ whiteSpace: 'pre-line' }}
        >
          {getUnifiedErrorMessage(error?.response?.data?.errors) ||
            formatMessage('genericError')}
        </Alert>
      )}

      {isSuccess && (
        <Alert
          data-test="create-folder-dialog-success-alert"
          severity="success"
        >
          {formatMessage('createFolderDialog.successfullyCreatedFolder')}
        </Alert>
      )}
    </Dialog>
  );
}
