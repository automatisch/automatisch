import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PropTypes from 'prop-types';
import * as React from 'react';

import Can from 'components/Can';
import useDeleteAgent from 'hooks/useDeleteAgent.ee';
import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';
import useFormatMessage from 'hooks/useFormatMessage';

function AgentContextMenu(props) {
  const { agentId, onClose, anchorEl } = props;

  const enqueueSnackbar = useEnqueueSnackbar();
  const formatMessage = useFormatMessage();
  const { mutateAsync: deleteAgent } = useDeleteAgent();

  const onAgentDelete = React.useCallback(async () => {
    await deleteAgent(agentId);

    enqueueSnackbar(formatMessage('agentContextMenu.successfullyDeleted'), {
      variant: 'success',
    });

    onClose();
  }, [deleteAgent, agentId, enqueueSnackbar, formatMessage, onClose]);

  return (
    <>
      <Menu
        open={true}
        onClose={onClose}
        hideBackdrop={false}
        anchorEl={anchorEl}
      >
        <Can I="manage" a="Agent" passThrough>
          {(allowed) => (
            <MenuItem
              data-test="delete-agent"
              disabled={!allowed}
              onClick={onAgentDelete}
            >
              {formatMessage('agent.delete')}
            </MenuItem>
          )}
        </Can>
      </Menu>
    </>
  );
}

AgentContextMenu.propTypes = {
  agentId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  anchorEl: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(window.Element) }),
  ]).isRequired,
};

export default AgentContextMenu;
