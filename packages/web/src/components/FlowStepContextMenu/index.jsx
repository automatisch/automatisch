import * as React from 'react';
import { useMutation } from '@apollo/client';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { DELETE_STEP } from 'graphql/mutations/delete-step';
import useFormatMessage from 'hooks/useFormatMessage';
function FlowStepContextMenu(props) {
  const { stepId, onClose, anchorEl, deletable } = props;
  const [deleteStep] = useMutation(DELETE_STEP, {
    refetchQueries: ['GetFlow', 'GetStepWithTestExecutions'],
  });
  const formatMessage = useFormatMessage();
  const deleteActionHandler = React.useCallback(
    async (event) => {
      event.stopPropagation();
      await deleteStep({ variables: { input: { id: stepId } } });
    },
    [stepId],
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
export default FlowStepContextMenu;
