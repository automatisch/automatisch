import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import CircularProgress from '@mui/material/CircularProgress';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import * as React from 'react';

import useFlow from 'hooks/useFlow';
import useCurrentUser from 'hooks/useCurrentUser';
import useFolders from 'hooks/useFolders';
import useFormatMessage from 'hooks/useFormatMessage';
import useFlowFolder from 'hooks/useFlowFolder';
import useUpdateFlowFolder from 'hooks/useUpdateFlowFolder';

function FlowFolderChangeDialog(props) {
  const { flowId, onClose, open = true } = props;

  const formatMessage = useFormatMessage();
  const { data: folders, isLoading: isFoldersLoading } = useFolders();
  const { data: flowFolder, isLoading: isFlowFolderLoading } =
    useFlowFolder(flowId);
  const { data: flowData, isPending: isFlowPending } = useFlow(flowId);
  const flow = flowData?.data;
  const { data: userData, isPending: isCurrentUserPending } = useCurrentUser();
  const currentUser = userData?.data;

  const [selectedFolder, setSelectedFolder] = React.useState(null);
  const [canMoveFlow, setCanMoveFlow] = React.useState(false);

  const uncategorizedFolder = { id: null, name: 'Uncategorized' };

  const {
    mutate: updateFlowFolder,
    isSuccess,
    isPending: isUpdateFlowFolderPending,
    error: createUpdateFlowFolderError,
  } = useUpdateFlowFolder(flowId);

  const handleChange = (event, newValue) => {
    setSelectedFolder(newValue ? newValue.id : null);
  };

  const handleConfirm = () => {
    updateFlowFolder(selectedFolder);
  };

  React.useEffect(
    function updateInitialSelectedFolder() {
      if (!flowFolder) return;

      setSelectedFolder(flowFolder.data?.id || null);
    },
    [flowFolder],
  );

  React.useEffect(
    function updateCanMoveFlow() {
      if (flow?.user_id && currentUser?.id) {
        // TODO: flow.user_id is currently unavailable, preventing this from running. Remove this comment once it becomes available.
        setCanMoveFlow(flow.user_id === currentUser.id);
      }
    },
    [currentUser?.id, flow?.user_id],
  );

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{formatMessage('flowFolderChangeDialog.title')}</DialogTitle>

      <IconButton
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
        <DialogContentText sx={{ mb: 2 }}>
          {formatMessage('flowFolderChangeDialog.description')}
        </DialogContentText>

        <FormControl fullWidth>
          <Autocomplete
            value={
              folders?.data.find((folder) => folder.id === selectedFolder) ||
              uncategorizedFolder
            }
            disableClearable={true}
            onChange={handleChange}
            options={[uncategorizedFolder, ...(folders?.data || [])]}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.name}
            loading={isFoldersLoading || isFlowFolderLoading}
            disabled={
              isFoldersLoading ||
              isFlowFolderLoading ||
              isCurrentUserPending ||
              isFlowPending
            }
            readOnly={!canMoveFlow}
            renderInput={(params) => (
              <TextField
                {...params}
                label={formatMessage('flowFolderChangeDialog.folderInputLabel')}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {(isFoldersLoading || isFlowFolderLoading) && (
                        <CircularProgress color="inherit" size={20} />
                      )}

                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </FormControl>
      </DialogContent>

      <DialogActions>
        <LoadingButton
          onClick={handleConfirm}
          data-test="flow-folder-change-dialog-confirm-button"
          loading={isUpdateFlowFolderPending}
          disabled={!canMoveFlow}
        >
          {formatMessage('flowFolderChangeDialog.confirm')}
        </LoadingButton>
      </DialogActions>

      {!canMoveFlow && (
        <Alert severity="info">
          {formatMessage('flowFolder.cannotMoveFlow')}
        </Alert>
      )}

      {createUpdateFlowFolderError && (
        <Alert
          data-test="flow-folder-change-dialog-error-alert"
          severity="error"
        >
          {createUpdateFlowFolderError.message}
        </Alert>
      )}

      {isSuccess && (
        <Alert
          data-test="flow-folder-change-dialog-success-alert"
          severity="success"
        >
          {formatMessage('flowFolderChangeDialog.successfullyUpdatedFolder')}
        </Alert>
      )}
    </Dialog>
  );
}

export default FlowFolderChangeDialog;
