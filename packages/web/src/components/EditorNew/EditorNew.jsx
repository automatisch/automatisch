import { useEffect, useState, useCallback } from 'react';
import { useMutation } from '@apollo/client';
import { useQueryClient } from '@tanstack/react-query';
import { FlowPropType } from 'propTypes/propTypes';
import ReactFlow, { useNodesState, useEdgesState, addEdge } from 'reactflow';
import 'reactflow/dist/style.css';
import { UPDATE_STEP } from 'graphql/mutations/update-step';

import { useAutoLayout } from './useAutoLayout';
import { useScrollBoundries } from './useScrollBoundries';
import FlowStepNode from './FlowStepNode/FlowStepNode';
import Edge from './Edge/Edge';
import InvisibleNode from './InvisibleNode/InvisibleNode';
import { EditorWrapper } from './style';

const nodeTypes = { flowStep: FlowStepNode, invisible: InvisibleNode };

const edgeTypes = {
  addNodeEdge: Edge,
};

const INVISIBLE_NODE_ID = 'invisible-node';

const generateEdgeId = (sourceId, targetId) => `${sourceId}-${targetId}`;

const EditorNew = ({ flow }) => {
  const [triggerStep] = flow.steps;
  const [currentStepId, setCurrentStepId] = useState(triggerStep.id);

  const [updateStep] = useMutation(UPDATE_STEP);
  const queryClient = useQueryClient();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  useAutoLayout();
  useScrollBoundries();

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

  const generateEdges = useCallback((flow, prevEdges) => {
    const newEdges =
      flow.steps
        .map((step, i) => {
          const sourceId = step.id;
          const targetId = flow.steps[i + 1]?.id;
          const edge = prevEdges?.find(
            (edge) => edge.id === generateEdgeId(sourceId, targetId),
          );
          if (targetId) {
            return {
              id: generateEdgeId(sourceId, targetId),
              source: sourceId,
              target: targetId,
              type: 'addNodeEdge',
              data: {
                flowId: flow.id,
                flowActive: flow.active,
                setCurrentStepId,
                layouted: !!edge,
              },
            };
          }
        })
        .filter((edge) => !!edge) || [];

    const lastStep = flow.steps[flow.steps.length - 1];

    return lastStep
      ? [
          ...newEdges,
          {
            id: generateEdgeId(lastStep.id, INVISIBLE_NODE_ID),
            source: lastStep.id,
            target: INVISIBLE_NODE_ID,
            type: 'addNodeEdge',
            data: {
              flowId: flow.id,
              flowActive: flow.active,
              setCurrentStepId,
              layouted: false,
            },
          },
        ]
      : newEdges;
  }, []);

  const generateNodes = useCallback(
    (flow, prevNodes) => {
      const newNodes = flow.steps.map((step, index) => {
        const node = prevNodes?.find(({ id }) => id === step.id);
        const collapsed = currentStepId !== step.id;
        return {
          id: step.id,
          type: 'flowStep',
          position: {
            x: node ? node.position.x : 0,
            y: node ? node.position.y : 0,
          },
          zIndex: collapsed ? 0 : 1,
          data: {
            step,
            index: index,
            flowId: flow.id,
            collapsed,
            openNextStep: openNextStep(flow.steps[index + 1]),
            onOpen: () => setCurrentStepId(step.id),
            onClose: () => setCurrentStepId(null),
            onChange: onStepChange,
            layouted: !!node,
          },
        };
      });

      const prevInvisibleNode = nodes.find((node) => node.type === 'invisible');

      return [
        ...newNodes,
        {
          id: INVISIBLE_NODE_ID,
          type: 'invisible',
          position: {
            x: prevInvisibleNode ? prevInvisibleNode.position.x : 0,
            y: prevInvisibleNode ? prevInvisibleNode.position.y : 0,
          },
        },
      ];
    },
    [currentStepId, nodes, onStepChange, openNextStep],
  );

  const updateNodesData = useCallback(
    (steps) => {
      setNodes((nodes) =>
        nodes.map((node) => {
          const step = steps.find((step) => step.id === node.id);
          if (step) {
            return { ...node, data: { ...node.data, step: { ...step } } };
          }
          return node;
        }),
      );
    },
    [setNodes],
  );

  const updateEdgesData = useCallback(
    (flow) => {
      setEdges((edges) =>
        edges.map((edge) => {
          return {
            ...edge,
            data: { ...edge.data, flowId: flow.id, flowActive: flow.active },
          };
        }),
      );
    },
    [setEdges],
  );

  useEffect(() => {
    setNodes(
      nodes.map((node) => {
        if (node.type === 'flowStep') {
          const collapsed = currentStepId !== node.data.step.id;
          return {
            ...node,
            zIndex: collapsed ? 0 : 1,
            data: {
              ...node.data,
              collapsed,
            },
          };
        }
        return node;
      }),
    );
  }, [currentStepId]);

  useEffect(() => {
    if (flow.steps.length + 1 !== nodes.length) {
      const newNodes = generateNodes(flow, nodes);
      const newEdges = generateEdges(flow, edges);

      setNodes(newNodes);
      setEdges(newEdges);
    } else {
      updateNodesData(flow.steps);
      updateEdgesData(flow);
    }
  }, [flow]);

  return (
    <EditorWrapper direction="column">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        panOnScroll
        panOnScrollMode="vertical"
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        panActivationKeyCode={null}
        proOptions={{ hideAttribution: true }}
      />
    </EditorWrapper>
  );
};

EditorNew.propTypes = {
  flow: FlowPropType.isRequired,
};

export default EditorNew;
