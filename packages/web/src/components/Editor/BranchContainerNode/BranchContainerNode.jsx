import PropTypes from 'prop-types';
import * as React from 'react';
import { Handle, Position } from '@xyflow/react';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { NodesContext } from '../contexts';
import { Container, Header, Content, BranchLabel } from './style';

const BranchContainerNode = ({ id }) => {
  const { onStepSelect, selectedStepId, steps } =
    React.useContext(NodesContext);
  const isSelected = selectedStepId === id;

  const step = steps?.find((s) => s.id === id);
  const branchName = step?.name || '';

  const handleClick = () => {
    onStepSelect?.(id);
  };

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={false}
        style={{ visibility: 'hidden' }}
      />
      <Container
        onClick={handleClick}
        selected={isSelected}
        data-test="branch-container-node"
      >
        <Header>
          <BranchLabel>
            <Typography variant="body2" fontWeight={500}>
              {branchName}
            </Typography>
            <ExpandMoreIcon fontSize="small" />
          </BranchLabel>
          <IconButton size="small">
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Header>
        <Content>
          <Typography variant="body2" color="text.secondary">
            {step.position}. Path conditions
          </Typography>
        </Content>
      </Container>
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={false}
        style={{ visibility: 'hidden' }}
      />
    </>
  );
};

BranchContainerNode.propTypes = {
  data: PropTypes.object,
  id: PropTypes.string.isRequired,
};

export default BranchContainerNode;
