import { Handle, Position } from 'reactflow';
import FlowStepBase from 'components/FlowStep';
import { Box } from '@mui/material';

function FlowStep({
  data: {
    step,
    index,
    flowId,
    collapsed,
    openNextStep,
    onOpen,
    onClose,
    onChange,
    currentStepId,
  },
  selected,
}) {
  return (
    <Box maxWidth={900} width="100vw" className="nodrag">
      <Handle type="target" position={Position.Top} />
      <FlowStepBase
        step={step}
        index={index + 1}
        collapsed={collapsed}
        onOpen={onOpen}
        onClose={onClose}
        onChange={onChange}
        flowId={flowId}
        onContinue={openNextStep}
      />
      <Handle type="source" position={Position.Bottom} />
    </Box>
  );
}

export default FlowStep;
