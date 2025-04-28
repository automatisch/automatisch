import { EdgeLabelRenderer, getStraightPath } from '@xyflow/react';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import PropTypes from 'prop-types';
import { useContext } from 'react';

import { EdgesContext } from '../EditorNew';

export default function Edge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  source,
  data: { laidOut },
}) {
  const { flowActive, onStepAdd, isCreateStepPending } =
    useContext(EdgesContext);

  const [, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
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

Edge.propTypes = {
  sourceX: PropTypes.number.isRequired,
  sourceY: PropTypes.number.isRequired,
  targetX: PropTypes.number.isRequired,
  targetY: PropTypes.number.isRequired,
  source: PropTypes.string.isRequired,
  data: PropTypes.shape({
    laidOut: PropTypes.bool,
  }).isRequired,
};
