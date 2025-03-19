import * as React from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import AddIcon from '@mui/icons-material/Add';
import ViewListIcon from '@mui/icons-material/ViewList';
import Inventory2Icon from '@mui/icons-material/Inventory2';

import { getGeneralErrorMessage } from 'helpers/errors';
import ConfirmationDialog from 'components/ConfirmationDialog';
import CreateFolderDialog from 'components/CreateFolderDialog';
import EditFolderDialog from 'components/EditFolderDialog';
import useFormatMessage from 'hooks/useFormatMessage';
import useFolders from 'hooks/useFolders';
import useDeleteFolder from 'hooks/useDeleteFolder';
import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';
import objectifyUrlSearchParams from 'helpers/objectifyUrlSearchParams';
import useFlowFilters from 'hooks/useFlowFilters';

import { ListItemIcon } from './style';

export default function Folders() {
  const [showEditFolderDialog, setShowEditFolderDialog] = React.useState(false);

  const formatMessage = useFormatMessage();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { data: folders } = useFolders();
  const enqueueSnackbar = useEnqueueSnackbar();

  const { enhanceExistingSearchParams } = useFlowFilters();

  const {
    mutateAsync: deleteFolder,
    error: deleteFolderError,
    reset: resetDeleteFolder,
  } = useDeleteFolder();

  const [showCreateFolderDialog, setShowCreateFolderDialog] =
    React.useState(false);

  const [showDeleteFolderDialog, setShowDeleteFolderDialog] =
    React.useState(false);

  const selectedFolderId = searchParams.get('folderId');

  const selectedFolder = folders?.data?.find(
    (folder) => folder.id === selectedFolderId,
  );

  const allFlowsFolder = enhanceExistingSearchParams('folderId', undefined);
  const unassignedFlowsFolder = enhanceExistingSearchParams('folderId', 'null');

  const allFlowsFolderSelected = selectedFolderId === null;
  const unassignedFlowsFolderSelected = selectedFolderId === 'null'; // intendedly stringified

  const generalErrorMessage = getGeneralErrorMessage({
    error: deleteFolderError,
    fallbackMessage: formatMessage('genericError'),
  });

  const handleDeleteFolderConfirmation = async () => {
    await deleteFolder(selectedFolderId);

    setShowDeleteFolderDialog(false);

    navigate({ search: allFlowsFolder });

    enqueueSnackbar(formatMessage('folders.successfullyDeleted'), {
      variant: 'success',
      SnackbarProps: {
        'data-test': 'snackbar-delete-folder-success',
      },
    });
  };

  const handleDeleteFolderClose = async () => {
    setShowDeleteFolderDialog(false);

    resetDeleteFolder();
  };

  const getFolderSearchParams = (folderId) => {
    return enhanceExistingSearchParams('folderId', folderId).toString();
  };

  const generateFolderItem = (folder) => {
    if (folder.id === selectedFolderId) {
      return generateListItem(folder);
    }

    return generateListItemButton(folder);
  };

  const generateListItem = (folder) => {
    return (
      <ListItem
        key={folder.id}
        disablePadding
        secondaryAction={
          <Stack direction="row" gap={1}>
            <IconButton
              edge="end"
              aria-label="edit"
              onClick={() => setShowEditFolderDialog(true)}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => setShowDeleteFolderDialog(true)}
            >
              <DeleteIcon />
            </IconButton>
          </Stack>
        }
      >
        <ListItemButton
          selected={true}
          disableRipple
          sx={{ pointerEvents: 'none' }}
        >
          <ListItemText primary={folder.name} />
        </ListItemButton>
      </ListItem>
    );
  };

  const generateListItemButton = (folder) => {
    return (
      <ListItemButton
        key={folder.id}
        component={Link}
        to={{ search: getFolderSearchParams(folder.id) }}
      >
        <ListItemText primary={folder.name} />
      </ListItemButton>
    );
  };

  return (
    <>
      <Box component={Card}>
        <List component="nav" aria-label="static folders">
          <ListItemButton
            component={Link}
            to={{ search: allFlowsFolder }}
            selected={allFlowsFolderSelected}
          >
            <ListItemIcon>
              <ViewListIcon />
            </ListItemIcon>

            <ListItemText primary={formatMessage('folders.allFlows')} />
          </ListItemButton>

          <ListItemButton
            component={Link}
            to={{ search: unassignedFlowsFolder }}
            selected={unassignedFlowsFolderSelected}
          >
            <ListItemIcon>
              <Inventory2Icon />
            </ListItemIcon>

            <ListItemText primary={formatMessage('folders.unassignedFlows')} />
          </ListItemButton>
        </List>

        <Divider />

        <List component="nav" aria-label="user folders">
          {folders?.data?.map((folder) => generateFolderItem(folder))}

          <ListItemButton onClick={() => setShowCreateFolderDialog(true)}>
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>

            <ListItemText primary={formatMessage('folders.createNew')} />
          </ListItemButton>
        </List>
      </Box>

      {showCreateFolderDialog && (
        <CreateFolderDialog onClose={() => setShowCreateFolderDialog(false)} />
      )}

      {selectedFolder && showEditFolderDialog && (
        <EditFolderDialog
          folder={selectedFolder}
          onClose={() => setShowEditFolderDialog(false)}
        />
      )}

      {selectedFolder && showDeleteFolderDialog && (
        <ConfirmationDialog
          title={formatMessage('deleteFolderDialog.title')}
          description={formatMessage('deleteFolderDialog.description')}
          onClose={handleDeleteFolderClose}
          onConfirm={handleDeleteFolderConfirmation}
          cancelButtonChildren={formatMessage('deleteFolderDialog.cancel')}
          confirmButtonChildren={formatMessage('deleteFolderDialog.confirm')}
          errorMessage={generalErrorMessage}
        />
      )}
    </>
  );
}
