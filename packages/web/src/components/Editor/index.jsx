import { useEffect, useCallback, useState, useMemo, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  ReactFlow,
  useEdgesState,
  applyNodeChanges,
  PanOnScrollMode,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { v4 as uuidv4 } from 'uuid';
import { debounce } from 'lodash';

import useUpdateStep from 'hooks/useUpdateStep';
import useCreateStep from 'hooks/useCreateStep';
import useUpdateFlow from 'hooks/useUpdateFlow';
import { FlowPropType } from 'propTypes/propTypes';

import { useScrollBoundaries } from './useScrollBoundaries';
import FlowStepNode from './FlowStepNode/FlowStepNode';
import Edge from './Edge/Edge';
import AddButtonNode from './AddButtonNode/AddButtonNode';
import { EDGE_TYPES, NODE_TYPES } from './constants';
import { EditorWrapper } from './style';
import { EdgesContext, NodesContext } from './contexts';
import StepDetailsSidebar from 'components/StepDetailsSidebar';
import { layoutWithElk } from './createElkGraph';

const ENABLE_AUTO_SELECT = false;

const nodeTypes = {
  [NODE_TYPES.FLOW_STEP]: FlowStepNode,
  [NODE_TYPES.ADD_BUTTON]: AddButtonNode,
};

const edgeTypes = {
  [EDGE_TYPES.ADD_NODE_EDGE]: Edge,
};

function findLastStepIdOfPaths(pathsId, steps = []) {
  const branches = steps.filter((step) => step.parentStepId === pathsId);
  const lastBranchId = branches[branches.length - 1].id;
  const branchSteps = steps.filter(
    (step) => step.parentStepId === lastBranchId,
  );

  return branchSteps[branchSteps.length - 1]?.id || lastBranchId;
}

function findBranchIdByStepId(stepId, steps = []) {
  const step = steps.find((step) => step.id === stepId);

  if (step.structuralType === 'branch') return step.id;

  if (step.structuralType === 'single') return step.parentStepId;

  return null;
}

const Editor = ({ flow }) => {
  const { mutateAsync: updateStep } = useUpdateStep();
  const { mutateAsync: updateFlow } = useUpdateFlow(flow?.id);
  const queryClient = useQueryClient();

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedStepId, setSelectedStepId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [containerHeight, setContainerHeight] = useState(null);
  const containerRef = useRef(null);

  const { mutateAsync: createStep, isPending: isCreateStepPending } =
    useCreateStep(flow?.id);

  useScrollBoundaries(containerHeight);

  const onStepDelete = useCallback(
    (nodeId) => {
      // Remove the node
      setNodes((nodes) => nodes.filter((node) => node.id !== nodeId));

      // Remove connected edges
      setEdges((edges) =>
        edges.filter(
          (edge) => edge.source !== nodeId && edge.target !== nodeId,
        ),
      );
    },
    [setNodes, setEdges],
  );

  const onStepAdd = useCallback(
    async ({ previousStepId, parentStepId, structuralType }) => {
      await createStep({
        previousStepId,
        parentStepId,
        structuralType,
      });
    },
    [createStep, setNodes, setEdges],
  );

  const onStepAddDebounced = useMemo(
    () => debounce(onStepAdd, 300),
    [onStepAdd],
  );

  const onNodesChange = useCallback(
    (changes) => {
      setNodes((oldNodes) => applyNodeChanges(changes, oldNodes));
    },
    [setNodes],
  );

  const onStepSelect = useCallback((stepId) => {
    setSelectedStepId(stepId);
    setSidebarOpen(true);
  }, []);

  const onClearSelection = useCallback(() => {
    setSelectedStepId(null);
    setSidebarOpen(false);
  }, []);

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

  const onFlowChange = useCallback(
    async (flowData) => {
      await updateFlow(flowData);
    },
    [updateFlow],
  );

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

  // Auto-select trigger step when editor loads
  useEffect(
    function autoSelectTriggerStep() {
      if (ENABLE_AUTO_SELECT === false) return;

      if (flow?.steps?.length > 0 && !selectedStepId) {
        const triggerStep = flow.steps[0]; // First step is always trigger
        setSelectedStepId(triggerStep.id);
        setSidebarOpen(true);
      }
    },
    [flow?.steps, selectedStepId],
  );

  // Layout flow steps with ELK
  useEffect(
    function layoutFlowSteps() {
      if (flow?.steps?.length === 0) {
        return;
      }

      (async () => {
        const layoutedGraph = await layoutWithElk(flow.steps);

        const nodes = layoutedGraph.children.map((node) => {
          const isAddButton = node.id.includes('--add-button');
          const baseNode = {
            ...node,
            type: isAddButton ? NODE_TYPES.ADD_BUTTON : NODE_TYPES.FLOW_STEP,
            position: { x: node.x, y: node.y },
            data: {},
          };

          if (isAddButton) {
            // Extract previous step ID from AddButtonNode ID
            // Format: {stepId}--add-button or {stepId}--add-button-after-merge
            const isMergePoint = node.id.includes('--add-button-after-merge');
            const isWithinBranch = node.id.includes(
              '--add-button-within-branch',
            );
            const isBranchCreationPoint = node.id.includes(
              '--add-button-branch',
            );
            const buttonNodeId = node.id.replace(/--add-button.*$/, '');

            if (isMergePoint) {
              baseNode.data.structuralType = 'single';
              baseNode.data.previousStepId = findLastStepIdOfPaths(
                buttonNodeId,
                flow.steps,
              );
            } else if (isBranchCreationPoint) {
              baseNode.data.structuralType = 'branch';
              baseNode.data.parentStepId = buttonNodeId;
              baseNode.data.previousStepId = findLastStepIdOfPaths(
                buttonNodeId,
                flow.steps,
              );
            } else if (isWithinBranch) {
              baseNode.data.structuralType = 'single';
              baseNode.data.previousStepId = buttonNodeId;
              baseNode.data.parentStepId = findBranchIdByStepId(
                buttonNodeId,
                flow.steps,
              );
            } else {
              baseNode.data.previousStepId = buttonNodeId;
            }
          }

          return baseNode;
        });

        const edges = layoutedGraph.edges.map((edge) => ({
          ...edge,
          type: EDGE_TYPES.ADD_NODE_EDGE,
          source: edge.sources[0],
          target: edge.targets[0],
        }));

        setNodes(nodes);
        setEdges(edges);
      })();
    },
    [flow?.steps],
  );

  return (
    <NodesContext.Provider
      value={{
        onStepChange,
        onFlowChange,
        onStepDelete,
        onStepSelect,
        onClearSelection,
        selectedStepId,
        sidebarOpen,
        flowId: flow?.id,
        steps: flow?.steps,
      }}
    >
      <EditorWrapper ref={containerRef}>
        <EdgesContext.Provider
          value={{
            flowActive: flow?.active,
            isCreateStepPending,
            onStepAdd: onStepAddDebounced,
          }}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            edgesFocusable={false}
            elementsSelectable={true}
            nodesConnectable={false}
            nodesDraggable={false}
            nodesFocusable={true}
            panOnScroll
            panOnScrollMode={PanOnScrollMode.Vertical}
            panOnDrag={[0, 1]}
            proOptions={{ hideAttribution: true }}
          />
        </EdgesContext.Provider>
        <StepDetailsSidebar key={selectedStepId} open={sidebarOpen} />
      </EditorWrapper>
    </NodesContext.Provider>
  );
};

Editor.propTypes = {
  flow: FlowPropType.isRequired,
};

export default Editor;
