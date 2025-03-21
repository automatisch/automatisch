import Dagre from '@dagrejs/dagre';
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

const edgeLaidOut = (edge, nodes) => {
  const sourceNode = nodes.find((node) => node.id === edge.source);
  const targetNodeNode = nodes.find((node) => node.id === edge.target);

  return Boolean(sourceNode?.measured && targetNodeNode?.measured);
};

export const getLaidOutElements = (nodes, edges) => {
  const graph = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  graph.setGraph({
    rankdir: 'TB',
    marginy: 60,
    ranksep: 64,
  });
  edges.forEach((edge) => graph.setEdge(edge.source, edge.target));
  nodes.forEach((node) =>
    graph.setNode(node.id, {
      ...node,
      width: node.measured?.width ?? 0,
      height: node.measured?.height ?? 0,
    }),
  );

  Dagre.layout(graph);

  return {
    nodes: nodes.map((node) => {
      const position = graph.node(node.id);
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      const x = position.x - (node.measured?.width ?? 0) / 2;
      const y = position.y - (node.measured?.height ?? 0) / 2;

      return {
        ...node,
        position: { x, y },
        ...(node.type === NODE_TYPES.FLOW_STEP
          ? { data: { ...node.data, laidOut: node.measured ? true : false } }
          : {}),
      };
    }),
    edges: edges.map((edge) => ({
      ...edge,
      data: { ...edge.data, laidOut: edgeLaidOut(edge, nodes) },
    })),
  };
};
