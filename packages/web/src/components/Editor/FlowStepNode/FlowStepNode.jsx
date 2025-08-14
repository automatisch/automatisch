import { useContext } from 'react';
import { Handle, Position } from '@xyflow/react';
import PropTypes from 'prop-types';

import FlowStep from 'components/FlowStep';

import { NodesContext } from '../contexts.js';
import { NodeWrapper, NodeInnerWrapper } from './style.js';

function FlowStepNode({ id }) {
  const { onStepDelete, onStepSelect, flowId, steps } =
    useContext(NodesContext);

  const step = steps.find(({ id: stepId }) => stepId === id);

  return (
    <NodeWrapper className="nodrag">
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
            onSelect={() => onStepSelect(step.id)}
            onDelete={onStepDelete}
            flowId={flowId}
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
};

export default FlowStepNode;
