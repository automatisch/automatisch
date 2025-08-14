import { Handle, Position } from '@xyflow/react';
import { Box, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useContext } from 'react';
import PropTypes from 'prop-types';

import { EdgesContext } from '../contexts.js';
import { DIMENSIONS } from '../constants.js';

function AddButtonNode({ id }) {
  const { flowActive, onStepAdd, isCreateStepPending } =
    useContext(EdgesContext);

  const handleClick = () => {
    // Extract the source step ID from the AddButtonNode ID
    // Format: {stepId}-add-button
    const sourceStepId = id.replace('--add-button', '');
    onStepAdd(sourceStepId);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: DIMENSIONS.ADD_BUTTON_WIDTH,
        height: DIMENSIONS.ADD_BUTTON_HEIGHT,
        position: 'relative',
      }}
      className="nodrag"
    >
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={false}
        style={{
          background: 'transparent',
          border: 'none',
          top: 0,
        }}
      />

      <IconButton
        onClick={handleClick}
        color="primary"
        disabled={isCreateStepPending || flowActive}
        sx={{
          padding: 0,
          width: DIMENSIONS.ADD_BUTTON_SIZE,
          height: DIMENSIONS.ADD_BUTTON_SIZE,
        }}
      >
        <AddIcon />
      </IconButton>

      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={false}
        style={{
          background: 'transparent',
          border: 'none',
          bottom: 0,
        }}
      />
    </Box>
  );
}

AddButtonNode.propTypes = {
  id: PropTypes.string.isRequired,
};

export default AddButtonNode;
