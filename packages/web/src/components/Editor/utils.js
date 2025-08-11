import ELK from 'elkjs/lib/elk.bundled.js';
import { NODE_TYPES } from './constants';

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

// Hardcoded dimensions for consistent layout
const NODE_WIDTH = 350;
const NODE_HEIGHT = 80;
const GRAPH_TOP_OFFSET = 40;

export const getLaidOutElements = async (nodes, edges, options = {}) => {
  const elk = new ELK();

  const elkOptions = {
    'elk.algorithm': 'layered',
    'elk.direction': 'DOWN',
    'elk.spacing.nodeNode': '80',
    'elk.layered.spacing.nodeNodeBetweenLayers': '64',
    'elk.layered.nodePlacement.strategy': 'SIMPLE',
    ...options,
  };

  const graph = {
    id: 'root',
    layoutOptions: elkOptions,
    children: nodes.map((node) => ({
      id: node.id,
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
    })),
    edges: edges.map((edge) => ({
      id: `${edge.source}-${edge.target}`,
      sources: [edge.source],
      targets: [edge.target],
    })),
  };

  const layoutedGraph = await elk.layout(graph);

  // Calculate the graph width to center it
  let maxX = 0;
  layoutedGraph.children.forEach((node) => {
    const nodeRightEdge = (node.x ?? 0) + (node.width ?? 0);
    if (nodeRightEdge > maxX) maxX = nodeRightEdge;
  });

  // Calculate horizontal offset to center the graph
  const viewportWidth = window.innerWidth;
  const graphWidth = maxX;
  const centerOffset = Math.max(0, (viewportWidth - graphWidth) / 2);

  return {
    nodes: nodes.map((node) => {
      const layoutedNode = layoutedGraph.children.find((n) => n.id === node.id);
      if (!layoutedNode) return node;

      return {
        ...node,
        position: {
          x: (layoutedNode.x ?? 0) + centerOffset,
          y: (layoutedNode.y ?? 0) + GRAPH_TOP_OFFSET,
        },
        // Since we're using hardcoded dimensions, always mark as laid out
        ...(node.type === NODE_TYPES.FLOW_STEP
          ? { data: { ...node.data, laidOut: true } }
          : {}),
      };
    }),
    edges: edges.map((edge) => ({
      ...edge,
      data: { ...edge.data, laidOut: true },
    })),
  };
};
