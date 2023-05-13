import * as React from 'react';
import { useMutation } from '@apollo/client';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import type { PopoverProps } from '@mui/material/Popover';

import { DELETE_STEP } from 'graphql/mutations/delete-step';
import useFormatMessage from 'hooks/useFormatMessage';

type FlowStepContextMenuProps = {
  stepId: string;
  onClose: PopoverProps['onClose'];
  anchorEl: HTMLButtonElement;
  deletable: boolean;
};

function FlowStepContextMenu(
  props: FlowStepContextMenuProps
): React.ReactElement {
  const { stepId, onClose, anchorEl, deletable } = props;
  const [deleteStep] = useMutation(DELETE_STEP, {
    refetchQueries: ['GetFlow', 'GetStepWithTestExecutions'],
  });
  const formatMessage = useFormatMessage();

  const deleteActionHandler = React.useCallback(
    async (event: React.SyntheticEvent) => {
      event.stopPropagation();
      await deleteStep({ variables: { input: { id: stepId } } });
    },
    [stepId]
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
