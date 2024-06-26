import PropTypes from 'prop-types';
import { Handle, Position } from 'reactflow';
import { Box, Stack, Typography } from '@mui/material';
import { useRef, useState } from 'react';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import IconButton from '@mui/material/IconButton';
import { Wrapper } from './style';

/* TODO 
    - add delete
    - add rename 
    - add translations
    - add collapsing?
*/

function PathNode({ data: { laidOut } }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const contextButtonRef = useRef(null);

  const onContextMenuClose = (event) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  const onContextMenuClick = (event) => {
    event.stopPropagation();
    setAnchorEl(contextButtonRef.current);
  };

  const deletePath = () => {
    setAnchorEl(null);
    onContextMenuClose();
  };

  return (
    <>
      <Box
        className="nodrag"
        sx={
          {
            // visibility: laidOut ? 'visible' : 'hidden',
          }
        }
      >
        <Handle
          type="target"
          position={Position.Top}
          isConnectable={false}
          style={{ visibility: 'hidden' }}
        />

        <Wrapper>
          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
          >
            <Typography sx={{ pr: 2 }}>Path</Typography>
            <IconButton
              color="primary"
              onClick={onContextMenuClick}
              ref={contextButtonRef}
            >
              <MoreHorizIcon />
            </IconButton>
          </Stack>
        </Wrapper>
        <Handle
          type="source"
          position={Position.Bottom}
          isConnectable={false}
          style={{ visibility: 'hidden' }}
        />
      </Box>
      {anchorEl && (
        <Menu
          open={true}
          onClose={onContextMenuClose}
          hideBackdrop={false}
          anchorEl={anchorEl}
        >
          <MenuItem onClick={deletePath}>Delete</MenuItem>
        </Menu>
      )}
    </>
  );
}

PathNode.propTypes = {
  data: PropTypes.shape({
    laidOut: PropTypes.bool,
  }).isRequired,
};

export default PathNode;
