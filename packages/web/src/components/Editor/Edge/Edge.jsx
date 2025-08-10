import { EdgeLabelRenderer } from '@xyflow/react';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import PropTypes from 'prop-types';
import { useContext } from 'react';

import { EdgesContext } from '../contexts.js';

export default function Edge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  source,
  data: { laidOut, isPlaceholder },
}) {
  const { flowActive, onStepAdd, isCreateStepPending } =
    useContext(EdgesContext);

  // Position for the + button (40px below source)
  const buttonY = sourceY + 40;

  // Path from source to + button (always shown)
  const pathToButton = `M ${sourceX} ${sourceY} L ${sourceX} ${buttonY}`;

  // Path from + button to target (only if not placeholder)
  const pathFromButton = isPlaceholder
    ? ''
    : ` M ${sourceX} ${buttonY} L ${sourceX} ${buttonY + 10} L ${targetX} ${buttonY + 10} L ${targetX} ${targetY}`;

  // Complete path
  const fullPath = pathToButton + pathFromButton;

  return (
    <>
      <path
        d={fullPath}
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
            transform: `translate(-50%, -50%) translate(${sourceX}px,${buttonY}px)`,
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

Edge.propTypes = {
  sourceX: PropTypes.number.isRequired,
  sourceY: PropTypes.number.isRequired,
  targetX: PropTypes.number.isRequired,
  targetY: PropTypes.number.isRequired,
  source: PropTypes.string.isRequired,
  data: PropTypes.shape({
    laidOut: PropTypes.bool,
    isPlaceholder: PropTypes.bool,
  }).isRequired,
};
