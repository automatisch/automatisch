import * as React from 'react';
import { useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import type { PopoverProps } from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';

import { DELETE_FLOW } from 'graphql/mutations/delete-flow';
import * as URLS from 'config/urls';
import useFormatMessage from 'hooks/useFormatMessage';

type ContextMenuProps = {
  flowId: string;
  onClose: () => void;
  anchorEl: PopoverProps['anchorEl'];
};

export default function ContextMenu(props: ContextMenuProps): React.ReactElement {
  const { flowId, onClose, anchorEl } = props;
  const [deleteFlow] = useMutation(DELETE_FLOW);
  const formatMessage = useFormatMessage();

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
      }
    });
  }, [flowId, deleteFlow]);

  return (
    <Menu
      open={true}
      onClose={onClose}
      hideBackdrop={false}
      anchorEl={anchorEl}
    >
      <MenuItem
        component={Link}
        to={URLS.FLOW(flowId)}
      >
        {formatMessage('flow.view')}
      </MenuItem>

      <MenuItem onClick={onFlowDelete}>
        {formatMessage('flow.delete')}
      </MenuItem>
    </Menu>
  );
};
