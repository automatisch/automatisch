import { EdgeLabelRenderer, getStraightPath, BaseEdge } from 'reactflow';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';

import PropTypes from 'prop-types';
import { useContext } from 'react';
import { EdgesContext } from '../../EditorNew';
import { Tooltip } from '@mui/material';

export default function PathsEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  source,
  data: { laidOut },
}) {
  const { stepCreationInProgress, flowActive, onAddPath } =
    useContext(EdgesContext);

  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const handleAddPath = () => {
    onAddPath(source);
  };

  return (
    <>
      <BaseEdge path={edgePath} />
      <EdgeLabelRenderer>
        <Tooltip title="Add path">
          <IconButton
            onClick={handleAddPath}
            color="primary"
            sx={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
              backgroundColor: '#fafafa',
              '&:hover': {
                backgroundColor: '#f0f3fa',
              },
              // visibility: laidOut ? 'visible' : 'hidden',
            }}
            disabled={stepCreationInProgress || flowActive}
          >
            <AddIcon />
          </IconButton>
        </Tooltip>
      </EdgeLabelRenderer>
    </>
  );
}

PathsEdge.propTypes = {
  sourceX: PropTypes.number.isRequired,
  sourceY: PropTypes.number.isRequired,
  targetX: PropTypes.number.isRequired,
  targetY: PropTypes.number.isRequired,
  source: PropTypes.string.isRequired,
  data: PropTypes.shape({
    laidOut: PropTypes.bool,
  }).isRequired,
};
