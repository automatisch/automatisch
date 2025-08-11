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
import AddButtonNode from './AddButtonNode/AddButtonNode';
import { getLaidOutElements } from './utils';
import { EDGE_TYPES, NODE_TYPES } from './constants';
import { EditorWrapper } from './style';
import { EdgesContext, NodesContext } from './contexts';
import StepDetailsSidebar from 'components/StepDetailsSidebar';

const ENABLE_AUTO_SELECT = false;

const nodeTypes = {
  [NODE_TYPES.FLOW_STEP]: FlowStepNode,
  [NODE_TYPES.BRANCH_CONTAINER]: BranchContainerNode,
  [NODE_TYPES.ADD_BUTTON]: AddButtonNode,
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
      const isMergePlaceholder = previousStepId.endsWith('-merge-placeholder');
      let actualPreviousStepId = previousStepId;

      if (isMergePlaceholder) {
        // Extract the paths node ID from merge placeholder
        actualPreviousStepId = previousStepId.replace('-merge-placeholder', '');
      } else if (isPlaceholder) {
        // Extract the branch ID from placeholder ID
        actualPreviousStepId = previousStepId.replace('-placeholder', '');
      }

      // Check if the previous step is a paths or branch node
      const previousStep = flow?.steps?.find(
        (s) => s.id === actualPreviousStepId,
      );
      const isAfterPaths = previousStep?.structuralType === 'paths';
      const isAfterBranch =
        previousStep?.structuralType === 'branch' ||
        (isPlaceholder && !isMergePlaceholder);

      // Check if the previous step is inside a branch (has a parentStepId)
      const isInsideBranch = previousStep?.parentStepId && !isAfterBranch;

      // Prepare creation parameters
      const createParams = {
        previousStepId: actualPreviousStepId,
        ...(isAfterPaths &&
          !isMergePlaceholder && {
            structuralType: 'branch',
            parentStepId: actualPreviousStepId,
          }),
        ...(isMergePlaceholder && {
          structuralType: 'single',
          // No parentStepId - this is a top-level step after merge
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

      // Add merge placeholder (AddButtonNode) for paths nodes
      flow.steps.forEach((step) => {
        if (step.structuralType === 'paths') {
          newNodes.push({
            id: `${step.id}-merge-placeholder`,
            type: NODE_TYPES.ADD_BUTTON,
            position: {
              x: 0,
              y: 0,
            },
            data: {
              laidOut: false,
            },
          });
        }
      });

      // Create edges based on step relationships
      const newEdges = [];
      const nodesWithOutgoingEdges = new Set();

      if (flow?.steps) {
        // 1. Connect sequential top-level nodes with AddButtonNodes between them
        const topLevelSteps = flow.steps.filter((s) => !s.parentStepId);
        topLevelSteps.sort((a, b) => a.position - b.position);

        for (let i = 0; i < topLevelSteps.length - 1; i++) {
          const addButtonId = `${topLevelSteps[i].id}-add-button`;

          // Add the AddButtonNode
          newNodes.push({
            id: addButtonId,
            type: NODE_TYPES.ADD_BUTTON,
            position: { x: 0, y: 0 },
            data: { laidOut: false },
          });

          // Connect step -> AddButton -> next step
          newEdges.push({
            id: uuidv4(),
            source: topLevelSteps[i].id,
            target: addButtonId,
            type: 'addNodeEdge',
            data: { laidOut: false },
          });
          newEdges.push({
            id: uuidv4(),
            source: addButtonId,
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

        // 3. Connect branch nodes to their children sequentially with AddButtonNodes
        const branchSteps = flow.steps.filter(
          (s) => s.structuralType === 'branch',
        );
        branchSteps.forEach((branch) => {
          const branchChildren = flow.steps
            .filter((s) => s.parentStepId === branch.id)
            .sort((a, b) => a.position - b.position);

          if (branchChildren.length > 0) {
            // Add AddButtonNode after branch
            const branchAddButtonId = `${branch.id}-add-button`;
            newNodes.push({
              id: branchAddButtonId,
              type: NODE_TYPES.ADD_BUTTON,
              position: { x: 0, y: 0 },
              data: { laidOut: false },
            });

            // Connect branch -> AddButton -> first child
            newEdges.push({
              id: uuidv4(),
              source: branch.id,
              target: branchAddButtonId,
              type: 'addNodeEdge',
              data: { laidOut: false },
            });
            newEdges.push({
              id: uuidv4(),
              source: branchAddButtonId,
              target: branchChildren[0].id,
              type: 'addNodeEdge',
              data: { laidOut: false },
            });
            nodesWithOutgoingEdges.add(branch.id);

            // Connect children sequentially within the branch with AddButtonNodes
            for (let i = 0; i < branchChildren.length - 1; i++) {
              const childAddButtonId = `${branchChildren[i].id}-add-button`;

              // Add AddButtonNode after each child
              newNodes.push({
                id: childAddButtonId,
                type: NODE_TYPES.ADD_BUTTON,
                position: { x: 0, y: 0 },
                data: { laidOut: false },
              });

              // Connect child -> AddButton -> next child
              newEdges.push({
                id: uuidv4(),
                source: branchChildren[i].id,
                target: childAddButtonId,
                type: 'addNodeEdge',
                data: { laidOut: false },
              });
              newEdges.push({
                id: uuidv4(),
                source: childAddButtonId,
                target: branchChildren[i + 1].id,
                type: 'addNodeEdge',
                data: { laidOut: false },
              });
              nodesWithOutgoingEdges.add(branchChildren[i].id);
            }

            // Add AddButtonNode after last child in branch
            const lastChild = branchChildren[branchChildren.length - 1];
            if (lastChild && !nodesWithOutgoingEdges.has(lastChild.id)) {
              const lastChildAddButtonId = `${lastChild.id}-add-button`;

              newNodes.push({
                id: lastChildAddButtonId,
                type: NODE_TYPES.ADD_BUTTON,
                position: { x: 0, y: 0 },
                data: { laidOut: false },
              });

              newEdges.push({
                id: uuidv4(),
                source: lastChild.id,
                target: lastChildAddButtonId,
                type: 'addNodeEdge',
                data: { laidOut: false },
              });
              nodesWithOutgoingEdges.add(lastChild.id);
            }
          } else {
            // For empty branches, use AddButtonNode instead of placeholder
            const branchAddButtonId = `${branch.id}-add-button`;
            newNodes.push({
              id: branchAddButtonId,
              type: NODE_TYPES.ADD_BUTTON,
              position: { x: 0, y: 0 },
              data: { laidOut: false },
            });

            newEdges.push({
              id: uuidv4(),
              source: branch.id,
              target: branchAddButtonId,
              type: 'addNodeEdge',
              data: { laidOut: false },
            });
            nodesWithOutgoingEdges.add(branch.id);
          }
        });

        // 4. Connect branch ends to merge node for paths
        pathsSteps.forEach((pathStep) => {
          const mergeNodeId = `${pathStep.id}-merge-placeholder`;
          const branches = flow.steps.filter(
            (s) =>
              s.parentStepId === pathStep.id && s.structuralType === 'branch',
          );

          branches.forEach((branch) => {
            const branchChildren = flow.steps
              .filter((s) => s.parentStepId === branch.id)
              .sort((a, b) => a.position - b.position);

            if (branchChildren.length > 0) {
              // Connect last child's AddButton to merge node
              const lastChild = branchChildren[branchChildren.length - 1];
              const lastChildAddButtonId = `${lastChild.id}-add-button`;
              newEdges.push({
                id: uuidv4(),
                source: lastChildAddButtonId,
                target: mergeNodeId,
                type: 'addNodeEdge',
                data: { laidOut: false },
              });
            } else {
              // For empty branches, connect branch's AddButton to merge
              const branchAddButtonId = `${branch.id}-add-button`;
              newEdges.push({
                id: uuidv4(),
                source: branchAddButtonId,
                target: mergeNodeId,
                type: 'addNodeEdge',
                data: { laidOut: false },
              });
            }
          });

          // Note: The merge node doesn't need its own placeholder edge
          // as it already serves as a placeholder for continuing the flow
        });

        // 5. For the last top-level step without branches, add an AddButtonNode
        const lastTopLevel = topLevelSteps[topLevelSteps.length - 1];

        if (lastTopLevel && !nodesWithOutgoingEdges.has(lastTopLevel.id)) {
          // Only add AddButtonNode if this isn't a paths step (which has branches)
          if (lastTopLevel.structuralType !== 'paths') {
            // Create an AddButtonNode for the last top-level step
            const addButtonId = `${lastTopLevel.id}-add-button`;

            // Add the AddButtonNode if it doesn't already exist
            if (!newNodes.find((n) => n.id === addButtonId)) {
              newNodes.push({
                id: addButtonId,
                type: NODE_TYPES.ADD_BUTTON,
                position: {
                  x: 0,
                  y: 0,
                },
                data: {
                  laidOut: false,
                },
              });
            }

            // Connect to the AddButtonNode
            newEdges.push({
              id: uuidv4(),
              source: lastTopLevel.id,
              target: addButtonId,
              type: 'addNodeEdge',
              data: { laidOut: false },
            });
            nodesWithOutgoingEdges.add(lastTopLevel.id);
          }
        }
      }

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
            panOnDrag={[0, 1]}
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
