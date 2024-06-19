import { useCallback, useEffect } from 'react';
import Dagre from '@dagrejs/dagre';
import { usePrevious } from 'hooks/usePrevious';
import { isEqual } from 'lodash';
import { useNodesInitialized, useNodes, useReactFlow } from 'reactflow';

const getLaidOutElements = (nodes, edges) => {
  const graph = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  graph.setGraph({
    rankdir: 'TB',
    marginy: 60,
    ranksep: 64,
  });
  edges.forEach((edge) => graph.setEdge(edge.source, edge.target));
  nodes.forEach((node) => graph.setNode(node.id, node));

  Dagre.layout(graph);

  return {
    nodes: nodes.map((node) => {
      const { x, y, width, height } = graph.node(node.id);
      return {
        ...node,
        position: { x: x - width / 2, y: y - height / 2 },
      };
    }),
    edges,
  };
};

export const useAutoLayout = () => {
  const nodes = useNodes();
  const prevNodes = usePrevious(nodes);
  const nodesInitialized = useNodesInitialized();
  const { getEdges, setNodes, setEdges } = useReactFlow();

  const onLayout = useCallback(
    (nodes, edges) => {
      const laidOutElements = getLaidOutElements(nodes, edges);

      setNodes([
        ...laidOutElements.nodes.map((node) => ({
          ...node,
          data: { ...node.data, laidOut: true },
        })),
      ]);
      setEdges([
        ...laidOutElements.edges.map((edge) => ({
          ...edge,
          data: { ...edge.data, laidOut: true },
        })),
      ]);
    },
    [setEdges, setNodes],
  );

  useEffect(() => {
    const shouldAutoLayout =
      nodesInitialized &&
      !isEqual(
        nodes.map(({ width, height }) => ({ width, height })),
        prevNodes.map(({ width, height }) => ({ width, height })),
      );

    if (shouldAutoLayout) {
      onLayout(nodes, getEdges());
    }
  }, [nodes]);
};
