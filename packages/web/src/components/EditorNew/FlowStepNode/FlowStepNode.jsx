import { Handle, Position } from 'reactflow';
import { Box } from '@mui/material';
import PropTypes from 'prop-types';

import FlowStep from 'components/FlowStep';
import { StepPropType } from 'propTypes/propTypes';

function FlowStepNode({
  data: {
    step,
    index,
    flowId,
    collapsed,
    openNextStep,
    onOpen,
    onClose,
    onChange,
    layouted,
  },
}) {
  return (
    <Box
      maxWidth={900}
      width="100vw"
      className="nodrag"
      sx={{ visibility: layouted ? 'visible' : 'hidden' }}
    >
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={false}
        style={{ visibility: 'hidden' }}
      />
      <FlowStep
        step={step}
        index={index + 1}
        collapsed={collapsed}
        onOpen={onOpen}
        onClose={onClose}
        onChange={onChange}
        flowId={flowId}
        onContinue={openNextStep}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={false}
        style={{ visibility: 'hidden' }}
      />
    </Box>
  );
}

FlowStepNode.propTypes = {
  data: PropTypes.shape({
    step: StepPropType.isRequired,
    index: PropTypes.number.isRequired,
    flowId: PropTypes.string.isRequired,
    collapsed: PropTypes.bool.isRequired,
    openNextStep: PropTypes.func.isRequired,
    onOpen: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    layouted: PropTypes.bool.isRequired,
  }).isRequired,
};

export default FlowStepNode;
