import { useEffect, useCallback, createContext, useRef } from 'react';
// import { useMutation } from '@apollo/client';
// import { useQueryClient } from '@tanstack/react-query';
import { FlowPropType } from 'propTypes/propTypes';
import ReactFlow, { useNodesState, useEdgesState } from 'reactflow';
import 'reactflow/dist/style.css';
// import { UPDATE_STEP } from 'graphql/mutations/update-step';
// import { CREATE_STEP } from 'graphql/mutations/create-step';

import { useAutoLayout } from './useAutoLayout';
import NodeOrPathsEdge from './Edges/NodeOrPathsEdge/NodeOrPathsEdge';
import FlowStepNode from './Nodes/FlowStepNode/FlowStepNode';
import InvisibleNode from './Nodes/InvisibleNode/InvisibleNode';
import PathsNode from './Nodes/PathsNode/PathsNode';
import { EditorWrapper } from './style';
import { generateEdges, generateNodes, updatedCollapsedNodes } from './utils';
import { EDGE_TYPES, NODE_TYPES } from './constants';
import { useFlow } from './temp/useFlow';
import PathNode from './Nodes/PathNode/PathNode';
import PathsEdge from './Edges/PathsEdge/PathsEdge';
import NodeEdge from './Edges/NodeEdge/NodeEdge';

export const EdgesContext = createContext();
export const NodesContext = createContext();

const nodeTypes = {
  [NODE_TYPES.FLOW_STEP]: FlowStepNode,
  [NODE_TYPES.INVISIBLE]: InvisibleNode,
  [NODE_TYPES.PATHS]: PathsNode,
  [NODE_TYPES.PATH]: PathNode,
};

const edgeTypes = {
  [EDGE_TYPES.ADD_NODE_OR_PATHS_EDGE]: NodeOrPathsEdge,
  [EDGE_TYPES.ADD_PATH_EDGE]: PathsEdge,
  [EDGE_TYPES.ADD_NODE_EDGE]: NodeEdge,
};

const EditorNew = () =>
  // { flow }
  {
    const { flow, createStep, createPaths, createPath } = useFlow();
    // const [updateStep] = useMutation(UPDATE_STEP);
    // const queryClient = useQueryClient();
    // const [createStep, { loading: stepCreationInProgress }] =
    //   useMutation(CREATE_STEP);
    const stepCreationInProgress = false;

    const [nodes, setNodes, onNodesChange] = useNodesState(
      generateNodes({ steps: flow.steps }),
    );
    const [edges, setEdges, onEdgesChange] = useEdgesState(
      generateEdges({ steps: flow.steps }),
    );

    useAutoLayout();

    const createdStepIdRef = useRef(null);

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
        // const mutationInput = {
        //   id: step.id,
        //   key: step.key,
        //   parameters: step.parameters,
        //   connection: {
        //     id: step.connection?.id,
        //   },
        //   flow: {
        //     id: flow.id,
        //   },
        // };
        // if (step.appKey) {
        //   mutationInput.appKey = step.appKey;
        // }
        // const updated = await updateStep({
        //   variables: { input: mutationInput },
        // });
        // await queryClient.invalidateQueries({
        //   queryKey: ['steps', step.id, 'connection'],
        // });
        // await queryClient.invalidateQueries({ queryKey: ['flows', flow.id] });
      },
      // [flow.id, updateStep, queryClient],
    );

    const onAddStep = async (previousStepId) => {
      const createdStepId = createStep(flow, previousStepId);
      createdStepIdRef.current = createdStepId;
    };

    console.log({ flow });

    useEffect(() => {
      // if (flow.steps.length + 1 !== nodes.length) {
      setNodes((nodes) =>
        generateNodes({
          prevNodes: nodes,
          steps: flow.steps,
          createdStepId: createdStepIdRef.current,
        }),
      );

      setEdges((edges) =>
        generateEdges({ prevEdges: edges, steps: flow.steps }),
      );

      if (createdStepIdRef.current) {
        createdStepIdRef.current = null;
      }
      // }
    }, [flow.steps]);

    return (
      <NodesContext.Provider
        value={{
          openNextStep,
          onStepOpen,
          onStepClose,
          onStepChange,
          flowId: flow.id,
          steps: flow.steps,
        }}
      >
        <EdgesContext.Provider
          value={{
            stepCreationInProgress,
            onAddStep,
            onAddPaths: createPaths,
            onAddPath: createPath,
            flowActive: flow.active,
          }}
        >
          <EditorWrapper direction="column">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              fitView
              maxZoom={1}
              minZoom={0.001}
              proOptions={{ hideAttribution: true }}
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
