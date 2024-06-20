import { Handle, Position } from 'reactflow';
import PropTypes from 'prop-types';

import FlowStep from 'components/FlowStep';

import { NodeWrapper, NodeInnerWrapper } from './style.js';
import { useContext } from 'react';
import { NodesContext } from '../EditorNew.jsx';

function FlowStepNode({ data: { collapsed, laidOut }, id }) {
  const { openNextStep, onStepOpen, onStepClose, onStepChange, flowId, steps } =
    useContext(NodesContext);

  const step = steps.find(({ id: stepId }) => stepId === id);

  return (
    <NodeWrapper
      className="nodrag"
      sx={{
        visibility: laidOut ? 'visible' : 'hidden',
      }}
    >
      <NodeInnerWrapper>
        <Handle
          type="target"
          position={Position.Top}
          isConnectable={false}
          style={{ visibility: 'hidden' }}
        />
        {step && (
          <FlowStep
            step={step}
            collapsed={collapsed}
            onOpen={() => onStepOpen(step.id)}
            onClose={onStepClose}
            onChange={onStepChange}
            flowId={flowId}
            onContinue={() => openNextStep(step.id)}
          />
        )}
        <Handle
          type="source"
          position={Position.Bottom}
          isConnectable={false}
          style={{ visibility: 'hidden' }}
        />
      </NodeInnerWrapper>
    </NodeWrapper>
  );
}

FlowStepNode.propTypes = {
  id: PropTypes.string,
  data: PropTypes.shape({
    collapsed: PropTypes.bool.isRequired,
    laidOut: PropTypes.bool.isRequired,
  }).isRequired,
};

export default FlowStepNode;
