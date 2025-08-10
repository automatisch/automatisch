import { EdgeLabelRenderer } from '@xyflow/react';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import PropTypes from 'prop-types';
import { useContext } from 'react';

import { EdgesContext } from '../contexts.js';

export default function BranchSplitEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  source,
  data: { laidOut, isBranchEdge, branchIndex, totalBranches },
}) {
  const { flowActive, onStepAdd, isCreateStepPending } =
    useContext(EdgesContext);

  // Calculate the split point
  const splitY = sourceY + 40;

  // For branch edges, create the fork pattern
  let pathData;

  if (isBranchEdge && totalBranches > 1) {
    // Calculate horizontal offset for branches
    const branchSpacing = 400; // Should match the spacing in utils.js
    const totalWidth = (totalBranches - 1) * branchSpacing;
    const centerX = sourceX;
    const leftmostX = centerX - totalWidth / 2;
    const rightmostX = centerX + totalWidth / 2;

    // Build the fork path
    pathData = `M ${sourceX} ${sourceY} L ${sourceX} ${splitY}`;

    // Draw horizontal line
    if (branchIndex === 0) {
      // Only draw the horizontal line once (for the first branch)
      pathData += ` M ${leftmostX} ${splitY} L ${rightmostX} ${splitY}`;
    }

    // Draw vertical line to target
    pathData += ` M ${targetX} ${splitY} L ${targetX} ${targetY}`;
  } else {
    // Simple straight line for single branches or non-branch edges
    pathData = `M ${sourceX} ${sourceY} L ${sourceX} ${splitY} L ${targetX} ${splitY} L ${targetX} ${targetY}`;
  }

  // Position the add button at the split point
  const labelX = sourceX;
  const labelY = splitY;

  return (
    <>
      <path
        d={pathData}
        fill="none"
        stroke="#b1b1b7"
        strokeWidth={2}
        className="react-flow__edge-path"
      />
      <EdgeLabelRenderer>
        <IconButton
          onClick={() => onStepAdd(source)}
          color="primary"
          sx={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
            visibility: laidOut ? 'visible' : 'hidden',
          }}
          disabled={isCreateStepPending || flowActive}
        >
          <AddIcon />
        </IconButton>
      </EdgeLabelRenderer>
    </>
  );
}

BranchSplitEdge.propTypes = {
  sourceX: PropTypes.number.isRequired,
  sourceY: PropTypes.number.isRequired,
  targetX: PropTypes.number.isRequired,
  targetY: PropTypes.number.isRequired,
  source: PropTypes.string.isRequired,
  target: PropTypes.string.isRequired,
  data: PropTypes.shape({
    laidOut: PropTypes.bool,
    isBranchEdge: PropTypes.bool,
    branchIndex: PropTypes.number,
    totalBranches: PropTypes.number,
  }).isRequired,
};
