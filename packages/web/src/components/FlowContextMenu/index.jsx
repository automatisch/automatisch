import PropTypes from 'prop-types';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useQueryClient } from '@tanstack/react-query';

import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';
import * as React from 'react';
import { Link } from 'react-router-dom';

import Can from 'components/Can';
import * as URLS from 'config/urls';
import useFormatMessage from 'hooks/useFormatMessage';
import useDuplicateFlow from 'hooks/useDuplicateFlow';
import useDeleteFlow from 'hooks/useDeleteFlow';
import useExportFlow from 'hooks/useExportFlow';
import useDownloadJsonAsFile from 'hooks/useDownloadJsonAsFile';

function ContextMenu(props) {
  const { flowId, onClose, anchorEl, onDuplicateFlow, appKey } = props;
  const enqueueSnackbar = useEnqueueSnackbar();
  const formatMessage = useFormatMessage();
  const queryClient = useQueryClient();
  const { mutateAsync: duplicateFlow } = useDuplicateFlow(flowId);
  const { mutateAsync: deleteFlow } = useDeleteFlow(flowId);
  const { mutateAsync: exportFlow } = useExportFlow(flowId);
  const downloadJsonAsFile = useDownloadJsonAsFile();

  const onFlowDuplicate = React.useCallback(async () => {
    await duplicateFlow();

    if (appKey) {
      await queryClient.invalidateQueries({
        queryKey: ['apps', appKey, 'flows'],
      });
    }

    enqueueSnackbar(formatMessage('flow.successfullyDuplicated'), {
      variant: 'success',
      SnackbarProps: {
        'data-test': 'snackbar-duplicate-flow-success',
      },
    });

    onDuplicateFlow?.();
    onClose();
  }, [
    appKey,
    enqueueSnackbar,
    onClose,
    duplicateFlow,
    queryClient,
    onDuplicateFlow,
    formatMessage,
  ]);

  const onFlowDelete = React.useCallback(async () => {
    await deleteFlow();

    if (appKey) {
      await queryClient.invalidateQueries({
        queryKey: ['apps', appKey, 'flows'],
      });
    }

    enqueueSnackbar(formatMessage('flow.successfullyDeleted'), {
      variant: 'success',
    });

    onClose();
  }, [
    deleteFlow,
    appKey,
    enqueueSnackbar,
    formatMessage,
    onClose,
    queryClient,
  ]);

  const onFlowExport = React.useCallback(async () => {
    const flowExport = await exportFlow();

    downloadJsonAsFile({
      contents: flowExport.data,
      name: flowExport.data.name,
    });

    enqueueSnackbar(formatMessage('flow.successfullyExported'), {
      variant: 'success',
    });

    onClose();
  }, [exportFlow, downloadJsonAsFile, enqueueSnackbar, formatMessage, onClose]);

  return (
    <Menu
      open={true}
      onClose={onClose}
      hideBackdrop={false}
      anchorEl={anchorEl}
    >
      <Can I="read" a="Flow" passThrough>
        {(allowed) => (
          <MenuItem disabled={!allowed} component={Link} to={URLS.FLOW(flowId)}>
            {formatMessage('flow.view')}
          </MenuItem>
        )}
      </Can>

      <Can I="create" a="Flow" passThrough>
        {(allowed) => (
          <MenuItem disabled={!allowed} onClick={onFlowDuplicate}>
            {formatMessage('flow.duplicate')}
          </MenuItem>
        )}
      </Can>

      <Can I="read" a="Flow" passThrough>
        {(allowed) => (
          <MenuItem disabled={!allowed} onClick={onFlowExport}>
            {formatMessage('flow.export')}
          </MenuItem>
        )}
      </Can>

      <Can I="delete" a="Flow" passThrough>
        {(allowed) => (
          <MenuItem disabled={!allowed} onClick={onFlowDelete}>
            {formatMessage('flow.delete')}
          </MenuItem>
        )}
      </Can>
    </Menu>
  );
}

ContextMenu.propTypes = {
  flowId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  anchorEl: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]).isRequired,
  onDuplicateFlow: PropTypes.func,
  appKey: PropTypes.string,
};

export default ContextMenu;
