import { Handle, Position } from '@xyflow/react';
import { Box, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useContext } from 'react';
import PropTypes from 'prop-types';

import { EdgesContext } from '../contexts.js';
import { DIMENSIONS } from '../constants.js';

function AddButtonNode({ data }) {
  const { flowActive, onStepAdd, isCreateStepPending } =
    useContext(EdgesContext);

  const handleClick = () => {
    const { previousStepId, parentStepId, structuralType } = data;

    onStepAdd({
      previousStepId,
      parentStepId,
      structuralType,
    });
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
  data: PropTypes.shape({
    previousStepId: PropTypes.string,
    parentStepId: PropTypes.string,
    structuralType: PropTypes.string,
  }),
};

export default AddButtonNode;
