import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PropTypes from 'prop-types';
import * as React from 'react';

import Can from 'components/Can';
import useDeleteMcpServer from 'hooks/useDeleteMcpServer.ee';
import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';
import useFormatMessage from 'hooks/useFormatMessage';

function McpServerContextMenu(props) {
  const { mcpServerId, onClose, anchorEl } = props;

  const enqueueSnackbar = useEnqueueSnackbar();
  const formatMessage = useFormatMessage();
  const { mutateAsync: deleteMcpServer } = useDeleteMcpServer();

  const onMcpServerDelete = React.useCallback(async () => {
    await deleteMcpServer(mcpServerId);

    enqueueSnackbar(formatMessage('mcpServerContextMenu.successfullyDeleted'), {
      variant: 'success',
    });

    onClose();
  }, [deleteMcpServer, mcpServerId, enqueueSnackbar, formatMessage, onClose]);

  return (
    <>
      <Menu
        open={true}
        onClose={onClose}
        hideBackdrop={false}
        anchorEl={anchorEl}
      >
        <Can I="manage" a="McpServer" passThrough>
          {(allowed) => (
            <MenuItem
              data-test="delete-mcp-server"
              disabled={!allowed}
              onClick={onMcpServerDelete}
            >
              {formatMessage('mcpServer.delete')}
            </MenuItem>
          )}
        </Can>
      </Menu>
    </>
  );
}

McpServerContextMenu.propTypes = {
  mcpServerId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  anchorEl: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(window.Element) }),
  ]).isRequired,
};

export default McpServerContextMenu;
