import PropTypes from 'prop-types';
import { useMutation } from '@apollo/client';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';
import * as React from 'react';
import { Link } from 'react-router-dom';

import Can from 'components/Can';
import * as URLS from 'config/urls';
import { DELETE_FLOW } from 'graphql/mutations/delete-flow';
import { DUPLICATE_FLOW } from 'graphql/mutations/duplicate-flow';
import useFormatMessage from 'hooks/useFormatMessage';
import { useQueryClient } from '@tanstack/react-query';

function ContextMenu(props) {
  const { flowId, onClose, anchorEl, mutate } = props;
  const enqueueSnackbar = useEnqueueSnackbar();
  const [deleteFlow] = useMutation(DELETE_FLOW);
  const [duplicateFlow] = useMutation(DUPLICATE_FLOW);
  const formatMessage = useFormatMessage();
  const queryClient = useQueryClient();

  const onFlowDuplicate = React.useCallback(async () => {
    await duplicateFlow({
      variables: { input: { id: flowId } },
    });

    enqueueSnackbar(formatMessage('flow.successfullyDuplicated'), {
      variant: 'success',
      SnackbarProps: {
        'data-test': 'snackbar-duplicate-flow-success',
      },
    });

    mutate();
    onClose();
  }, [flowId, onClose, duplicateFlow, queryClient]);

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

    enqueueSnackbar(formatMessage('flow.successfullyDeleted'), {
      variant: 'success',
    });

    mutate();
    onClose();
  }, [flowId, onClose, deleteFlow]);

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
};

export default ContextMenu;
