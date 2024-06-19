import { INVISIBLE_NODE_ID, NODE_TYPES } from './constants';

export const generateEdgeId = (sourceId, targetId) => `${sourceId}-${targetId}`;

export const updatedCollapsedNodes = (nodes, openStepId) => {
  return nodes.map((node) => {
    if (node.type !== NODE_TYPES.FLOW_STEP) {
      return node;
    }

    const collapsed = node.id !== openStepId;
    return {
      ...node,
      zIndex: collapsed ? 0 : 1,
      data: { ...node.data, collapsed },
    };
  });
};

export const generateInitialNodes = (flow) => {
  const newNodes = flow.steps.map((step, index) => {
    const collapsed = index !== 0;

    return {
      id: step.id,
      type: NODE_TYPES.FLOW_STEP,
      position: {
        x: 0,
        y: 0,
      },
      zIndex: collapsed ? 0 : 1,
      data: {
        collapsed,
        laidOut: false,
      },
    };
  });

  return [
    ...newNodes,
    {
      id: INVISIBLE_NODE_ID,
      type: NODE_TYPES.INVISIBLE,
      position: {
        x: 0,
        y: 0,
      },
    },
  ];
};

export const generateInitialEdges = (flow) => {
  const newEdges = flow.steps
    .map((step, i) => {
      const sourceId = step.id;
      const targetId = flow.steps[i + 1]?.id;
      if (targetId) {
        return {
          id: generateEdgeId(sourceId, targetId),
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
            laidOut: false,
          },
        },
      ]
    : newEdges;
};
