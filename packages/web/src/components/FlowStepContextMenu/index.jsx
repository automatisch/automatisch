import PropTypes from 'prop-types';
import * as React from 'react';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import useDeleteStep from 'hooks/useDeleteStep';
import useFormatMessage from 'hooks/useFormatMessage';
import { useQueryClient } from '@tanstack/react-query';

function FlowStepContextMenu(props) {
  const { stepId, onClose, onDelete, anchorEl, deletable, flowId } = props;
  const formatMessage = useFormatMessage();
  const queryClient = useQueryClient();
  const { mutateAsync: deleteStep } = useDeleteStep();

  const deleteActionHandler = React.useCallback(
    async (event) => {
      event.stopPropagation();

      await deleteStep(stepId);

      await queryClient.invalidateQueries({ queryKey: ['flows', flowId] });
      onDelete?.(stepId);
    },
    [deleteStep, onDelete, stepId, queryClient, flowId],
  );

  return (
    <Menu
      open={true}
      onClose={onClose}
      hideBackdrop={false}
      anchorEl={anchorEl}
    >
      {deletable && (
        <MenuItem onClick={deleteActionHandler}>
          {formatMessage('connection.delete')}
        </MenuItem>
      )}
    </Menu>
  );
}

FlowStepContextMenu.propTypes = {
  stepId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  anchorEl: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(window.Element) }),
  ]),
  deletable: PropTypes.bool.isRequired,
  flowId: PropTypes.string.isRequired,
};

export default FlowStepContextMenu;
