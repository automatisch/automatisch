import { useCallback, useEffect, useMemo } from 'react';
import Dagre from '@dagrejs/dagre';
import { usePrevious } from 'hooks/usePrevious';
import { isEqual } from 'lodash';
import { useNodesInitialized, useNodes, useReactFlow } from 'reactflow';

export const useAutoLayout = () => {
  const nodes = useNodes();
  const prevNodes = usePrevious(nodes);
  const nodesInitialized = useNodesInitialized();
  const { getEdges, setNodes, setEdges } = useReactFlow();

  const graph = useMemo(
    () => new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({})),
    [],
  );

  const getLayoutedElements = useCallback(
    (nodes, edges) => {
      graph.setGraph({
        rankdir: 'TB',
        marginy: 60,
        marginx: 60,
        universalSep: true,
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
    },
    [graph],
  );

  const onLayout = useCallback(
    (nodes, edges) => {
      const layouted = getLayoutedElements(nodes, edges);

      setNodes([...layouted.nodes]);
      setEdges([...layouted.edges]);
    },
    [setEdges, setNodes, getLayoutedElements],
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
