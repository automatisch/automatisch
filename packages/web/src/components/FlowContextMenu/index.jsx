import PropTypes from 'prop-types';
import { useMutation } from '@apollo/client';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useQueryClient } from '@tanstack/react-query';

import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';
import * as React from 'react';
import { Link } from 'react-router-dom';

import Can from 'components/Can';
import * as URLS from 'config/urls';
import { DELETE_FLOW } from 'graphql/mutations/delete-flow';
import { DUPLICATE_FLOW } from 'graphql/mutations/duplicate-flow';
import useFormatMessage from 'hooks/useFormatMessage';

function ContextMenu(props) {
  const { flowId, onClose, anchorEl, onDuplicateFlow, onDeleteFlow, appKey } =
    props;
  const enqueueSnackbar = useEnqueueSnackbar();
  const formatMessage = useFormatMessage();
  const queryClient = useQueryClient();
  const [duplicateFlow] = useMutation(DUPLICATE_FLOW);
  const [deleteFlow] = useMutation(DELETE_FLOW);

  const onFlowDuplicate = React.useCallback(async () => {
    await duplicateFlow({
      variables: { input: { id: flowId } },
    });

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
  }, [flowId, onClose, duplicateFlow, queryClient, onDuplicateFlow]);

  const onFlowDelete = React.useCallback(async () => {
    await deleteFlow({
      variables: { input: { id: flowId } },
      update: (cache) => {
        const flowCacheId = cache.identify({
          __typename: 'Flow',
          id: flowId,
        });
        cache.evict({
          id: flowCacheId,
        });
      },
    });

    if (appKey) {
      await queryClient.invalidateQueries({
        queryKey: ['apps', appKey, 'flows'],
      });
    }

    enqueueSnackbar(formatMessage('flow.successfullyDeleted'), {
      variant: 'success',
    });

    onDeleteFlow?.();
    onClose();
  }, [flowId, onClose, deleteFlow, queryClient, onDeleteFlow]);

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
  onDeleteFlow: PropTypes.func,
  onDuplicateFlow: PropTypes.func,
  appKey: PropTypes.string,
};

export default ContextMenu;
