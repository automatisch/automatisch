import PropTypes from 'prop-types';
import * as React from 'react';
import { useMutation } from '@apollo/client';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import { DELETE_STEP } from 'graphql/mutations/delete-step';
import useFormatMessage from 'hooks/useFormatMessage';
import { useQueryClient } from '@tanstack/react-query';

function FlowStepContextMenu(props) {
  const { stepId, onClose, anchorEl, deletable, flowId } = props;
  const formatMessage = useFormatMessage();
  const queryClient = useQueryClient();
  const [deleteStep] = useMutation(DELETE_STEP);

  const deleteActionHandler = React.useCallback(
    async (event) => {
      event.stopPropagation();
      await deleteStep({ variables: { input: { id: stepId } } });
      await queryClient.invalidateQueries({ queryKey: ['flows', flowId] });
    },
    [stepId, queryClient],
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
  anchorEl: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
  deletable: PropTypes.bool.isRequired,
  flowId: PropTypes.string.isRequired,
};

export default FlowStepContextMenu;
