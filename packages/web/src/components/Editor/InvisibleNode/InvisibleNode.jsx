import { Handle, Position } from '@xyflow/react';
import { Box } from '@mui/material';

// This node is used for adding an edge with add node button after the last flow step node
function InvisibleNode() {
  return (
    <Box
      maxWidth={300}
      height={80}
      width="100vw"
      className="nodrag"
      sx={{ visibility: 'visible', bgcolor: 'red' }}
    >
      <Handle type="target" position={Position.Top} isConnectable={false} />
      Invisible node
    </Box>
  );
}

export default InvisibleNode;
