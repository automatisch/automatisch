import {
  useEffect,
  useCallback,
  createContext,
  useRef,
  useState,
  useMemo,
} from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ReactFlow, useEdgesState, applyNodeChanges } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { v4 as uuidv4 } from 'uuid';
import { debounce } from 'lodash';

import useUpdateStep from 'hooks/useUpdateStep';
import useCreateStep from 'hooks/useCreateStep';
import { FlowPropType } from 'propTypes/propTypes';

import { useScrollBoundaries } from './useScrollBoundaries';
import FlowStepNode from './FlowStepNode/FlowStepNode';
import Edge from './Edge/Edge';
import InvisibleNode from './InvisibleNode/InvisibleNode';
import { getLaidOutElements, updatedCollapsedNodes } from './utils';
import { EDGE_TYPES, INVISIBLE_NODE_ID, NODE_TYPES } from './constants';
import { EditorWrapper } from './style';

export const EdgesContext = createContext();
export const NodesContext = createContext();

const nodeTypes = {
  [NODE_TYPES.FLOW_STEP]: FlowStepNode,
  [NODE_TYPES.INVISIBLE]: InvisibleNode,
};

const edgeTypes = {
  [EDGE_TYPES.ADD_NODE_EDGE]: Edge,
};

const EditorNew = ({ flow }) => {
  const { mutateAsync: updateStep } = useUpdateStep();
  const queryClient = useQueryClient();

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState();
  const [containerHeight, setContainerHeight] = useState(null);
  const containerRef = useRef(null);
  const { mutateAsync: createStep, isPending: isCreateStepPending } =
    useCreateStep(flow?.id);

  useScrollBoundaries(containerHeight);

  const onStepDelete = useCallback(
    (nodeId) => {
      const prevEdge = edges.find((edge) => edge.target === nodeId);
      const edgeToDelete = edges.find((edge) => edge.source === nodeId);

      const newEdges = edges
        .map((edge) => {
          if (
            edge.id === edgeToDelete?.id ||
            (edge.id === prevEdge?.id && !edgeToDelete)
          ) {
            return null;
          } else if (edge.id === prevEdge?.id) {
            return {
              ...prevEdge,
              target: edgeToDelete?.target,
            };
          }
          return edge;
        })
        .filter((edge) => !!edge);

      setNodes((nodes) => {
        const newNodes = nodes.filter((node) => node.id !== nodeId);
        const laidOutElements = getLaidOutElements(newNodes, newEdges);
        setEdges([...laidOutElements.edges]);
        return [...laidOutElements.nodes];
      });
    },
    [edges, setEdges],
  );

  const onStepAdd = useCallback(
    async (previousStepId) => {
      const { data: createdStep } = await createStep({ previousStepId });

      setNodes((nodes) => {
        const newNode = {
          id: createdStep.id,
          type: NODE_TYPES.FLOW_STEP,
          position: {
            x: 0,
            y: 0,
          },
          data: {
            laidOut: false,
          },
        };

        const newNodes = nodes.flatMap((node) => {
          if (node.id === previousStepId) {
            return [node, newNode];
          }
          return node;
        });
        return updatedCollapsedNodes(newNodes, createdStep.id);
      });

      setEdges((edges) => {
        const newEdges = edges
          .map((edge) => {
            if (edge.source === previousStepId) {
              const previousTarget = edge.target;
              return [
                { ...edge, target: createdStep.id },
                {
                  id: uuidv4(),
                  source: createdStep.id,
                  target: previousTarget,
                  type: EDGE_TYPES.ADD_NODE_EDGE,
                  data: {
                    laidOut: false,
                  },
                },
              ];
            }
            return edge;
          })
          .flat();

        return newEdges;
      });
    },
    [createStep, setEdges],
  );

  const onStepAddDebounced = useMemo(
    () => debounce(onStepAdd, 300),
    [onStepAdd],
  );

  const onNodesChange = useCallback(
    (changes) => {
      setNodes((oldNodes) => {
        const newNodes = applyNodeChanges(changes, oldNodes);

        if (changes?.some((change) => change.type === 'dimensions')) {
          const laidOutElements = getLaidOutElements(newNodes, edges);
          setEdges([...laidOutElements.edges]);
          return [...laidOutElements.nodes];
        } else {
          return newNodes;
        }
      });
    },
    [setNodes, setEdges, edges],
  );

  const openNextStep = useCallback(
    (currentStepId) => {
      setNodes((nodes) => {
        const currentStepIndex = nodes.findIndex(
          (node) => node.id === currentStepId,
        );
        if (currentStepIndex >= 0) {
          const nextStep = nodes[currentStepIndex + 1];
          return updatedCollapsedNodes(nodes, nextStep.id);
        }
        return nodes;
      });
    },
    [setNodes],
  );

  const onStepClose = useCallback(() => {
    setNodes((nodes) => updatedCollapsedNodes(nodes));
  }, [setNodes]);

  const onStepOpen = useCallback(
    (stepId) => {
      setNodes((nodes) => updatedCollapsedNodes(nodes, stepId));
    },
    [setNodes],
  );

  const onStepChange = useCallback(
    async (step) => {
      const payload = {
        id: step.id,
        key: step.key,
        parameters: step.parameters,
        connectionId: step.connection?.id,
      };

      if (step.name || step.keyLabel) {
        payload.name = step.name || step.keyLabel;
      }

      if (step.appKey) {
        payload.appKey = step.appKey;
      }

      await updateStep(payload);

      await queryClient.invalidateQueries({
        queryKey: ['steps', step.id, 'connection'],
      });
    },
    [updateStep, queryClient],
  );

  useEffect(function initiateNodesAndEdges() {
    const newNodes = flow?.steps.map((step, index) => {
      return {
        id: step.id,
        type: NODE_TYPES.FLOW_STEP,
        position: {
          x: 0,
          y: 0,
        },
        zIndex: index !== 0 ? 0 : 1,
        data: {
          collapsed: index !== 0,
          laidOut: false,
        },
      };
    });

    newNodes.push({
      id: INVISIBLE_NODE_ID,
      type: NODE_TYPES.INVISIBLE,
      position: {
        x: 0,
        y: 0,
      },
    });

    const newEdges = newNodes
      .map((node, i) => {
        const sourceId = node.id;
        const targetId = newNodes[i + 1]?.id;
        if (targetId) {
          return {
            id: uuidv4(),
            source: sourceId,
            target: targetId,
            type: 'addNodeEdge',
            data: {
              laidOut: false,
            },
          };
        }
        return null;
      })
      .filter((edge) => !!edge);

    setNodes(newNodes);
    setEdges(newEdges);
  }, []);

  useEffect(function updateContainerHeightOnResize() {
    const updateHeight = () => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.clientHeight);
      }
    };

    updateHeight();

    window.addEventListener('resize', updateHeight);

    return () => {
      window.removeEventListener('resize', updateHeight);
    };
  }, []);

  return (
    <NodesContext.Provider
      value={{
        openNextStep,
        onStepOpen,
        onStepClose,
        onStepChange,
        onStepDelete,
        flowId: flow?.id,
        steps: flow?.steps,
      }}
    >
      <EdgesContext.Provider
        value={{
          flowActive: flow?.active,
          isCreateStepPending,
          onStepAdd: onStepAddDebounced,
        }}
      >
        <EditorWrapper direction="column" ref={containerRef}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
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
            elementsSelectable={false}
          />
        </EditorWrapper>
      </EdgesContext.Provider>
    </NodesContext.Provider>
  );
};

EditorNew.propTypes = {
  flow: FlowPropType.isRequired,
};

export default EditorNew;
