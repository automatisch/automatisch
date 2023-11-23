import * as React from 'react';
import { Link } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import type { PopoverProps } from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';
import type { IConnection } from '@automatisch/types';

import * as URLS from 'config/urls';
import useFormatMessage from 'hooks/useFormatMessage';

type Action = {
  type: 'test' | 'reconnect' | 'delete' | 'shareConnection';
};

type ContextMenuProps = {
  appKey: string;
  connection: IConnection;
  onClose: () => void;
  onMenuItemClick: (event: React.MouseEvent, action: Action) => void;
  anchorEl: PopoverProps['anchorEl'];
  disableReconnection: boolean;
};

export default function ContextMenu(
  props: ContextMenuProps
): React.ReactElement {
  const {
    appKey,
    connection,
    onClose,
    onMenuItemClick,
    anchorEl,
    disableReconnection,
  } = props;
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
      <MenuItem onClick={createActionHandler({ type: 'test' })}>
        {formatMessage('adminAppsConnections.testConnection')}
      </MenuItem>

      <MenuItem
        component={Link}
        disabled={disableReconnection}
        to={URLS.ADMIN_APP_RECONNECT_CONNECTION(
          appKey,
          connection.id,
          connection.appAuthClientId
        )}
        onClick={createActionHandler({ type: 'reconnect' })}
      >
        {formatMessage('adminAppsConnections.reconnect')}
      </MenuItem>

      <MenuItem
        component={Link}
        to={URLS.ADMIN_APP_SHARE_CONNECTION(appKey, connection.id)}
        onClick={createActionHandler({ type: 'shareConnection' })}
      >
        {formatMessage('adminAppsConnections.shareConnection')}
      </MenuItem>

      <MenuItem onClick={createActionHandler({ type: 'delete' })}>
        {formatMessage('adminAppsConnections.delete')}
      </MenuItem>
    </Menu>
  );
}
