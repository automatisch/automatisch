import * as React from 'react';
import { Link } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import type { PopoverProps } from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';

import * as URLS from 'config/urls';
import useFormatMessage from 'hooks/useFormatMessage';

type Action = {
  type: 'test' | 'reconnect' | 'delete' | 'viewFlows';
};

type ContextMenuProps = {
  appKey: string;
  connectionId: string;
  onClose: () => void;
  onMenuItemClick: (event: React.MouseEvent, action: Action) => void;
  anchorEl: PopoverProps['anchorEl'];
};

export default function ContextMenu(
  props: ContextMenuProps
): React.ReactElement {
  const { appKey, connectionId, onClose, onMenuItemClick, anchorEl } = props;
  const formatMessage = useFormatMessage();

  const createActionHandler = React.useCallback(
    (action: Action) => {
      return function clickHandler(event: React.MouseEvent) {
        onMenuItemClick(event, action);

        onClose();
      };
    },
    [onMenuItemClick, onClose]
  );

  return (
    <Menu
      open={true}
      onClose={onClose}
      hideBackdrop={false}
      anchorEl={anchorEl}
    >
      <MenuItem
        component={Link}
        to={URLS.APP_FLOWS_FOR_CONNECTION(appKey, connectionId)}
        onClick={createActionHandler({ type: 'viewFlows' })}
      >
        {formatMessage('connection.viewFlows')}
      </MenuItem>

      <MenuItem onClick={createActionHandler({ type: 'test' })}>
        {formatMessage('connection.testConnection')}
      </MenuItem>

      <MenuItem
        component={Link}
        to={URLS.APP_RECONNECT_CONNECTION(appKey, connectionId)}
        onClick={createActionHandler({ type: 'reconnect' })}
      >
        {formatMessage('connection.reconnect')}
      </MenuItem>

      <MenuItem onClick={createActionHandler({ type: 'delete' })}>
        {formatMessage('connection.delete')}
      </MenuItem>
    </Menu>
  );
}
