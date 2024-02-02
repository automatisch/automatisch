import PropTypes from 'prop-types';
import * as React from 'react';
import { Link } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import * as URLS from 'config/urls';
import useFormatMessage from 'hooks/useFormatMessage';
import { ConnectionPropType } from 'propTypes/propTypes';
import { useQueryClient } from '@tanstack/react-query';
import Can from 'components/Can';

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
  const queryClient = useQueryClient();

  const createActionHandler = React.useCallback(
    (action) => {
      return async function clickHandler(event) {
        onMenuItemClick(event, action);

        if (['test', 'reconnect', 'delete'].includes(action.type)) {
          await queryClient.invalidateQueries({
            queryKey: ['apps', appKey, 'connections'],
          });
        }
        onClose();
      };
    },
    [onMenuItemClick, onClose, queryClient],
  );

  return (
    <Menu
      open={true}
      onClose={onClose}
      hideBackdrop={false}
      anchorEl={anchorEl}
    >
      <Can I="read" a="Flow" passThrough>
        {(allowed) => (
          <MenuItem
            component={Link}
            to={URLS.APP_FLOWS_FOR_CONNECTION(appKey, connection.id)}
            onClick={createActionHandler({ type: 'viewFlows' })}
            disabled={!allowed}
          >
            {formatMessage('connection.viewFlows')}
          </MenuItem>
        )}
      </Can>

      <Can I="update" a="Connection" passThrough>
        {(allowed) => (
          <MenuItem
            onClick={createActionHandler({ type: 'test' })}
            disabled={!allowed}
          >
            {formatMessage('connection.testConnection')}
          </MenuItem>
        )}
      </Can>

      <Can I="create" a="Connection" passThrough>
        {(allowed) => (
          <MenuItem
            component={Link}
            disabled={!allowed || disableReconnection}
            to={URLS.APP_RECONNECT_CONNECTION(
              appKey,
              connection.id,
              connection.appAuthClientId,
            )}
            onClick={createActionHandler({ type: 'reconnect' })}
          >
            {formatMessage('connection.reconnect')}
          </MenuItem>
        )}
      </Can>

      <Can I="delete" a="Connection" passThrough>
        {(allowed) => (
          <MenuItem
            onClick={createActionHandler({ type: 'delete' })}
            disabled={!allowed}
          >
            {formatMessage('connection.delete')}
          </MenuItem>
        )}
      </Can>
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
