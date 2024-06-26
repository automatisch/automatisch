import { EdgeLabelRenderer, getStraightPath, BaseEdge } from 'reactflow';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import PropTypes from 'prop-types';
import { useContext, useState } from 'react';
import { EdgesContext } from '../../EditorNew';
import { Tooltip } from '@mui/material';

export default function NodeOrPathsEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  source,
  data: { laidOut },
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { stepCreationInProgress, flowActive, onAddStep, onAddPaths } =
    useContext(EdgesContext);

  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const handleAddStep = () => {
    onAddStep(source);
    handleClose();
  };

  const handleAddPaths = () => {
    onAddPaths(source);
    handleClose();
  };

  return (
    <>
      <BaseEdge path={edgePath} />
      <EdgeLabelRenderer>
        <Tooltip title="Add step or paths">
          <IconButton
            onClick={handleClick}
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
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        >
          <MenuItem onClick={handleAddStep}>Step</MenuItem>
          <MenuItem onClick={handleAddPaths}>Paths</MenuItem>
        </Menu>
      </EdgeLabelRenderer>
    </>
  );
}

NodeOrPathsEdge.propTypes = {
  sourceX: PropTypes.number.isRequired,
  sourceY: PropTypes.number.isRequired,
  targetX: PropTypes.number.isRequired,
  targetY: PropTypes.number.isRequired,
  source: PropTypes.string.isRequired,
  data: PropTypes.shape({
    laidOut: PropTypes.bool,
  }).isRequired,
};
