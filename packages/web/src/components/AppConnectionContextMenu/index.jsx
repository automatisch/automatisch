import PropTypes from 'prop-types';
import * as React from 'react';
import { Link } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import * as URLS from 'config/urls';
import useFormatMessage from 'hooks/useFormatMessage';
import { ConnectionPropType } from 'propTypes/propTypes';

function ContextMenu(props) {
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
    (action) => {
      return function clickHandler(event) {
        onMenuItemClick(event, action);
        onClose();
      };
    },
    [onMenuItemClick, onClose],
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
        to={URLS.APP_FLOWS_FOR_CONNECTION(appKey, connection.id)}
        onClick={createActionHandler({ type: 'viewFlows' })}
      >
        {formatMessage('connection.viewFlows')}
      </MenuItem>

      <MenuItem onClick={createActionHandler({ type: 'test' })}>
        {formatMessage('connection.testConnection')}
      </MenuItem>

      <MenuItem
        component={Link}
        disabled={disableReconnection}
        to={URLS.APP_RECONNECT_CONNECTION(
          appKey,
          connection.id,
          connection.appAuthClientId,
        )}
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

ContextMenu.propTypes = {
  appKey: PropTypes.string.isRequired,
  connection: ConnectionPropType.isRequired,
  onClose: PropTypes.func.isRequired,
  onMenuItemClick: PropTypes.func.isRequired,
  anchorEl: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
  disableReconnection: PropTypes.bool.isRequired,
};

export default ContextMenu;
