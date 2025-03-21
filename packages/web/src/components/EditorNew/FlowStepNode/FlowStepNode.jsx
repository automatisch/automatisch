import { useContext } from 'react';
import { Handle, Position } from '@xyflow/react';
import PropTypes from 'prop-types';

import FlowStep from 'components/FlowStep';

import { NodesContext } from '../EditorNew.jsx';
import { NodeWrapper, NodeInnerWrapper } from './style.js';

function FlowStepNode({ data: { collapsed, laidOut }, id }) {
  const {
    openNextStep,
    onStepOpen,
    onStepClose,
    onStepChange,
    onStepDelete,
    flowId,
    steps,
  } = useContext(NodesContext);

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
            onDelete={onStepDelete}
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
