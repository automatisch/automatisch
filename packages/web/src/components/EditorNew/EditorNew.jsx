import { useEffect, useState, useCallback } from 'react';
import { useMutation } from '@apollo/client';
import { useQueryClient } from '@tanstack/react-query';
import { FlowPropType } from 'propTypes/propTypes';
import ReactFlow, { useNodesState, useEdgesState, addEdge } from 'reactflow';
import 'reactflow/dist/style.css';
import { Stack } from '@mui/material';

import { UPDATE_STEP } from 'graphql/mutations/update-step';
import FlowStep from './FlowStep/FlowStep';
import { useAutoLayout } from './useAutoLayout';

const nodeTypes = { flowStep: FlowStep };

const EditorNew = ({ flow }) => {
  const [triggerStep] = flow.steps;
  const [currentStepId, setCurrentStepId] = useState(triggerStep.id);

  const [updateStep] = useMutation(UPDATE_STEP);
  const queryClient = useQueryClient();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  useAutoLayout();

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const openNextStep = useCallback(
    (nextStep) => () => {
      setCurrentStepId(nextStep?.id);
    },
    [],
  );

  const onStepChange = useCallback(
    async (step) => {
      const mutationInput = {
        id: step.id,
        key: step.key,
        parameters: step.parameters,
        connection: {
          id: step.connection?.id,
        },
        flow: {
          id: flow.id,
        },
      };

      if (step.appKey) {
        mutationInput.appKey = step.appKey;
      }

      await updateStep({
        variables: { input: mutationInput },
      });
      await queryClient.invalidateQueries({
        queryKey: ['steps', step.id, 'connection'],
      });
      await queryClient.invalidateQueries({ queryKey: ['flows', flow.id] });
    },
    [flow.id, updateStep, queryClient],
  );

  useEffect(() => {
    setNodes(
      nodes.map((node) => ({
        ...node,
        data: { ...node.data, collapsed: currentStepId !== node.data.step.id },
      })),
    );
  }, [currentStepId]);

  useEffect(() => {
    const getInitialNodes = () => {
      return flow?.steps?.map((step, index) => ({
        id: step.id,
        position: { x: 0, y: 0 },
        data: {
          step,
          index: index,
          flowId: flow.id,
          collapsed: currentStepId !== step.id,
          openNextStep: openNextStep(flow?.steps[index + 1]),
          onOpen: () => setCurrentStepId(step.id),
          onClose: () => setCurrentStepId(null),
          onChange: onStepChange,
        },
        type: 'flowStep',
      }));
    };

    const getInitialEdges = () => {
      return flow?.steps?.map((step, i) => {
        const sourceId = step.id;
        const targetId = flow.steps[i + 1]?.id;
        return {
          id: i,
          source: sourceId,
          target: targetId,
          animated: false,
        };
      });
    };

    const nodes = getInitialNodes();
    const edges = getInitialEdges();

    setNodes(nodes);
    setEdges(edges);
  }, []);

  return (
    <Stack
      direction="column"
      sx={{
        flexGrow: 1,
        '& > div': {
          flexGrow: 1,
        },
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        panOnScroll
        panOnScrollMode="vertical"
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        panActivationKeyCode={null}
              ></ReactFlow>
    </Stack>
  );
};

EditorNew.propTypes = {
  flow: FlowPropType.isRequired,
};

export default EditorNew;
