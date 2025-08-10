import {
  useEffect,
  useLayoutEffect,
  useCallback,
  useState,
  useMemo,
  useRef,
} from 'react';
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
import BranchContainerNode from './BranchContainerNode/BranchContainerNode';
import Edge from './Edge/Edge';
import BranchSplitEdge from './BranchSplitEdge/BranchSplitEdge';
import InvisibleNode from './InvisibleNode/InvisibleNode';
import { getLaidOutElements } from './utils';
import { EDGE_TYPES, NODE_TYPES } from './constants';
import { EditorWrapper } from './style';
import { EdgesContext, NodesContext } from './contexts';
import StepDetailsSidebar from 'components/StepDetailsSidebar';

const ENABLE_AUTO_SELECT = false;

const nodeTypes = {
  [NODE_TYPES.FLOW_STEP]: FlowStepNode,
  [NODE_TYPES.BRANCH_CONTAINER]: BranchContainerNode,
  [NODE_TYPES.INVISIBLE]: InvisibleNode,
};

const edgeTypes = {
  [EDGE_TYPES.ADD_NODE_EDGE]: Edge,
  [EDGE_TYPES.BRANCH_SPLIT]: BranchSplitEdge,
};

const Editor = ({ flow }) => {
  const { mutateAsync: updateStep } = useUpdateStep();
  const { mutateAsync: updateFlow } = useUpdateFlow(flow?.id);
  const queryClient = useQueryClient();

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState();
  const [selectedStepId, setSelectedStepId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
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
        getLaidOutElements(newNodes, newEdges).then((laidOutElements) => {
          setEdges([...laidOutElements.edges]);
          setNodes([...laidOutElements.nodes]);
        });
        return newNodes;
      });
    },
    [edges, setEdges],
  );

  const onStepAdd = useCallback(
    async (previousStepId) => {
      // Check if this is a placeholder node
      const isPlaceholder = previousStepId.endsWith('-placeholder');
      let actualPreviousStepId = previousStepId;

      if (isPlaceholder) {
        // Extract the branch ID from placeholder ID
        actualPreviousStepId = previousStepId.replace('-placeholder', '');
      }

      // Check if the previous step is a paths or branch node
      const previousStep = flow?.steps?.find(
        (s) => s.id === actualPreviousStepId,
      );
      const isAfterPaths = previousStep?.structuralType === 'paths';
      const isAfterBranch =
        previousStep?.structuralType === 'branch' || isPlaceholder;

      // Check if the previous step is inside a branch (has a parentStepId)
      const isInsideBranch = previousStep?.parentStepId && !isAfterBranch;

      // Prepare creation parameters
      const createParams = {
        previousStepId: actualPreviousStepId,
        ...(isAfterPaths && {
          structuralType: 'branch',
          parentStepId: actualPreviousStepId,
        }),
        ...(isAfterBranch && {
          structuralType: 'single',
          parentStepId: actualPreviousStepId,
        }),
        ...(isInsideBranch && {
          structuralType: 'single',
          parentStepId: previousStep.parentStepId, // Keep the same parent as the previous step
        }),
      };

      const { data: createdStep } = await createStep(createParams);

      // Determine node type based on structural type
      const nodeType =
        createdStep.structuralType === 'branch'
          ? NODE_TYPES.BRANCH_CONTAINER
          : NODE_TYPES.FLOW_STEP;

      const newNode = {
        id: createdStep.id,
        type: nodeType,
        position: {
          x: 0,
          y: 0,
        },
        data: {
          laidOut: false,
        },
      };

      const updatedNodes = nodes.flatMap((node) => {
        if (node.id === previousStepId) {
          return [node, newNode];
        }
        return node;
      });

      const updatedEdges = edges
        .map((edge) => {
          if (edge.source === previousStepId) {
            const previousTarget = edge.target;
            const wasPlaceholder = edge.data?.isPlaceholder;

            // If the previous edge was to a placeholder, keep it as placeholder
            if (wasPlaceholder) {
              return [
                {
                  ...edge,
                  target: createdStep.id,
                  data: { ...edge.data, isPlaceholder: false },
                },
                {
                  id: uuidv4(),
                  source: createdStep.id,
                  target: `${createdStep.id}-end-placeholder`,
                  type: EDGE_TYPES.ADD_NODE_EDGE,
                  data: {
                    laidOut: false,
                    isPlaceholder: true,
                  },
                },
              ];
            } else {
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
          }
          return edge;
        })
        .flat();

      // Recalculate layout with the new node and edges
      const laidOutElements = await getLaidOutElements(
        updatedNodes,
        updatedEdges,
      );
      setNodes(laidOutElements.nodes);
      setEdges(laidOutElements.edges);
    },
    [createStep, nodes, edges, setEdges, flow?.steps],
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

  const [initialNodes, setInitialNodes] = useState([]);
  const [initialEdges, setInitialEdges] = useState([]);

  useEffect(
    function initiateNodesAndEdges() {
      const newNodes = flow?.steps.map((step, index) => {
        // Use BranchContainerNode for branch steps
        const nodeType =
          step.structuralType === 'branch'
            ? NODE_TYPES.BRANCH_CONTAINER
            : NODE_TYPES.FLOW_STEP;

        return {
          id: step.id,
          type: nodeType,
          position: {
            x: 0,
            y: 0,
          },
          zIndex: index !== 0 ? 0 : 1,
          data: {
            laidOut: false,
          },
        };
      });

      // Add invisible placeholder nodes for empty branches and end placeholders
      const branchSteps = flow.steps.filter(
        (s) => s.structuralType === 'branch',
      );
      branchSteps.forEach((branch) => {
        const branchChildren = flow.steps.filter(
          (s) => s.parentStepId === branch.id,
        );
        if (branchChildren.length === 0) {
          newNodes.push({
            id: `${branch.id}-placeholder`,
            type: NODE_TYPES.INVISIBLE,
            position: {
              x: 0,
              y: 0,
            },
            data: {
              isPlaceholder: true,
              parentBranchId: branch.id,
            },
          });
        }
      });

      // Add invisible placeholder nodes for steps that will have placeholder edges
      flow.steps.forEach((step) => {
        // Add end placeholder for steps in branches that don't have a next step
        if (step.parentStepId) {
          const parentBranch = flow.steps.find(
            (s) => s.id === step.parentStepId,
          );
          if (parentBranch?.structuralType === 'branch') {
            const branchChildren = flow.steps
              .filter((s) => s.parentStepId === step.parentStepId)
              .sort((a, b) => a.position - b.position);
            const isLastInBranch =
              branchChildren[branchChildren.length - 1]?.id === step.id;
            if (isLastInBranch) {
              newNodes.push({
                id: `${step.id}-end-placeholder`,
                type: NODE_TYPES.INVISIBLE,
                position: {
                  x: 0,
                  y: 0,
                },
                data: {
                  isPlaceholder: true,
                },
              });
            }
          }
        }
      });

      // Create edges based on step relationships
      const newEdges = [];
      const nodesWithOutgoingEdges = new Set();

      if (flow?.steps) {
        // 1. Connect sequential top-level nodes
        const topLevelSteps = flow.steps.filter((s) => !s.parentStepId);
        topLevelSteps.sort((a, b) => a.position - b.position);

        for (let i = 0; i < topLevelSteps.length - 1; i++) {
          newEdges.push({
            id: uuidv4(),
            source: topLevelSteps[i].id,
            target: topLevelSteps[i + 1].id,
            type: 'addNodeEdge',
            data: { laidOut: false },
          });
          nodesWithOutgoingEdges.add(topLevelSteps[i].id);
        }

        // 2. Connect paths nodes to their branch children
        const pathsSteps = flow.steps.filter(
          (s) => s.structuralType === 'paths',
        );
        pathsSteps.forEach((pathStep) => {
          const branches = flow.steps.filter(
            (s) =>
              s.parentStepId === pathStep.id && s.structuralType === 'branch',
          );
          branches.forEach((branch, index) => {
            newEdges.push({
              id: uuidv4(),
              source: pathStep.id,
              target: branch.id,
              type: EDGE_TYPES.BRANCH_SPLIT,
              data: {
                laidOut: false,
                isBranchEdge: true,
                branchIndex: index,
                totalBranches: branches.length,
              },
            });
            nodesWithOutgoingEdges.add(pathStep.id);
          });
        });

        // 3. Connect branch nodes to their children sequentially
        const branchSteps = flow.steps.filter(
          (s) => s.structuralType === 'branch',
        );
        console.log('Branch steps:', branchSteps);
        branchSteps.forEach((branch) => {
          const branchChildren = flow.steps
            .filter((s) => s.parentStepId === branch.id)
            .sort((a, b) => a.position - b.position);
          console.log(`Children of branch ${branch.name}:`, branchChildren);

          if (branchChildren.length > 0) {
            // Connect branch to first child
            newEdges.push({
              id: uuidv4(),
              source: branch.id,
              target: branchChildren[0].id,
              type: 'addNodeEdge',
              data: { laidOut: false },
            });
            nodesWithOutgoingEdges.add(branch.id);

            // Connect children sequentially within the branch
            for (let i = 0; i < branchChildren.length - 1; i++) {
              newEdges.push({
                id: uuidv4(),
                source: branchChildren[i].id,
                target: branchChildren[i + 1].id,
                type: 'addNodeEdge',
                data: { laidOut: false },
              });
              nodesWithOutgoingEdges.add(branchChildren[i].id);
            }

            // Add placeholder edge for last child in branch
            const lastChild = branchChildren[branchChildren.length - 1];
            if (lastChild && !nodesWithOutgoingEdges.has(lastChild.id)) {
              newEdges.push({
                id: uuidv4(),
                source: lastChild.id,
                target: `${lastChild.id}-end-placeholder`,
                type: 'addNodeEdge',
                data: { laidOut: false, isPlaceholder: true },
              });
              nodesWithOutgoingEdges.add(lastChild.id);
            }
          } else {
            // For empty branches, create edge to invisible placeholder
            const placeholderId = `${branch.id}-placeholder`;
            newEdges.push({
              id: uuidv4(),
              source: branch.id,
              target: placeholderId,
              type: 'addNodeEdge',
              data: { laidOut: false, isPlaceholder: true },
            });
            nodesWithOutgoingEdges.add(branch.id);
          }
        });

        // 4. For the last top-level step without branches, add an invisible node
        const lastTopLevel = topLevelSteps[topLevelSteps.length - 1];

        if (lastTopLevel && !nodesWithOutgoingEdges.has(lastTopLevel.id)) {
          // Only add invisible node if this isn't a paths step (which has branches)
          if (lastTopLevel.structuralType !== 'paths') {
            // Create an invisible node for the last top-level step
            const invisibleNodeId = `${lastTopLevel.id}-end-placeholder`;

            // Add the invisible node if it doesn't already exist
            if (!newNodes.find((n) => n.id === invisibleNodeId)) {
              newNodes.push({
                id: invisibleNodeId,
                type: NODE_TYPES.INVISIBLE,
                position: {
                  x: 0,
                  y: 0,
                },
                data: {
                  isPlaceholder: true,
                },
              });
            }

            // Connect to the invisible node
            newEdges.push({
              id: uuidv4(),
              source: lastTopLevel.id,
              target: invisibleNodeId,
              type: 'addNodeEdge',
              data: { laidOut: false, isPlaceholder: true },
            });
            nodesWithOutgoingEdges.add(lastTopLevel.id);
          }
        }
      }

      console.log('All edges created:', newEdges);
      setInitialNodes(newNodes);
      setInitialEdges(newEdges);
    },
    [flow?.steps],
  );

  // Calculate the initial layout before browser paint
  useLayoutEffect(() => {
    if (initialNodes.length > 0 && initialEdges.length >= 0) {
      getLaidOutElements(initialNodes, initialEdges, flow?.steps).then(
        ({ nodes: layoutedNodes, edges: layoutedEdges }) => {
          setNodes(layoutedNodes);
          setEdges(layoutedEdges);
        },
      );
    }
  }, [initialNodes, initialEdges, flow?.steps, setNodes, setEdges]);

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

  useEffect(
    function reLayoutOnWindowResize() {
      let resizeTimeout;
      const handleResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          if (nodes.length > 0 && edges.length >= 0) {
            getLaidOutElements(nodes, edges, flow?.steps).then(
              ({ nodes: layoutedNodes, edges: layoutedEdges }) => {
                setNodes(layoutedNodes);
                setEdges(layoutedEdges);
              },
            );
          }
        }, 200);
      };

      window.addEventListener('resize', handleResize);

      return () => {
        clearTimeout(resizeTimeout);
        window.removeEventListener('resize', handleResize);
      };
    },
    [nodes, edges, flow?.steps, setNodes, setEdges],
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
            panOnDrag={[0]}
            zoomOnDoubleClick={false}
            zoomOnPinch={false}
            zoomOnScroll={false}
            minZoom={1}
            maxZoom={1}
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
