import PropTypes from 'prop-types';
import { Handle, Position } from 'reactflow';
import { Avatar, Box, Stack, Typography } from '@mui/material';
import { useRef, useState } from 'react';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import CallSplitIcon from '@mui/icons-material/CallSplit';

import IconButton from '@mui/material/IconButton';
import { Wrapper } from './style';

/* TODO 
    - add delete
    - add rename 
    - add translations
    - add collapsing?
*/

function PathsNode({ data: { laidOut } }) {
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

  const deletePaths = () => {
    setAnchorEl(null);
    onContextMenuClose();
  };

  return (
    <>
      <Box
        width={900}
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
          <Stack justifyContent="space-between" direction="row">
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar
                sx={{ display: 'flex', width: 50, height: 50 }}
                variant="square"
              >
                <CallSplitIcon
                  fontSize="large"
                  sx={{ transform: 'rotate(180deg)' }}
                />
              </Avatar>
              {/* TODO name from path data */}
              <Typography>Paths</Typography>
            </Stack>
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
          <MenuItem onClick={deletePaths}>Delete</MenuItem>
        </Menu>
      )}
    </>
  );
}

PathsNode.propTypes = {
  data: PropTypes.shape({
    laidOut: PropTypes.bool,
  }).isRequired,
};

export default PathsNode;
