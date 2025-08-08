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

const edgeLaidOut = (edge, nodes) => {
  const sourceNode = nodes.find((node) => node.id === edge.source);
  const targetNodeNode = nodes.find((node) => node.id === edge.target);

  return Boolean(sourceNode?.measured && targetNodeNode?.measured);
};

export const getLaidOutElements = async (nodes, edges) => {
  const elk = new ELK();
  
  const elkOptions = {
    'elk.algorithm': 'layered',
    'elk.direction': 'DOWN',
    'elk.spacing.nodeNode': '80',
    'elk.layered.spacing.nodeNodeBetweenLayers': '64',
    'elk.layered.nodePlacement.strategy': 'SIMPLE',
  };

  const graph = {
    id: 'root',
    layoutOptions: elkOptions,
    children: nodes.map((node) => ({
      id: node.id,
      width: node.measured?.width ?? 0,
      height: node.measured?.height ?? 0,
    })),
    edges: edges.map((edge) => ({
      id: `${edge.source}-${edge.target}`,
      sources: [edge.source],
      targets: [edge.target],
    })),
  };

  const layoutedGraph = await elk.layout(graph);

  return {
    nodes: nodes.map((node) => {
      const layoutedNode = layoutedGraph.children.find((n) => n.id === node.id);
      if (!layoutedNode) return node;

      return {
        ...node,
        position: { x: layoutedNode.x ?? 0, y: layoutedNode.y ?? 0 },
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
