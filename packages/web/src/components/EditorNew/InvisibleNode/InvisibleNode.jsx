import { Handle, Position } from 'reactflow';
import { Box } from '@mui/material';

// This node is used for adding an edge with add node button after the last flow step node
function InvisibleNode() {
  return (
    <Box
      maxWidth={900}
      width="100vw"
      className="nodrag"
      sx={{ visibility: 'hidden' }}
    >
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={false}
        style={{ visibility: 'hidden' }}
      />
      Invisible node
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={false}
        style={{ visibility: 'hidden' }}
      />
    </Box>
  );
}

export default InvisibleNode;
