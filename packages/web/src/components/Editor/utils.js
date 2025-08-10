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

export const getLaidOutElements = async (
  nodes,
  edges,
  steps = [],
  options = {},
) => {
  const elk = new ELK();

  const elkOptions = {
    'elk.algorithm': 'layered',
    'elk.direction': 'DOWN',
    'elk.spacing.nodeNode': '40',
    'elk.layered.spacing.nodeNodeBetweenLayers': '80',
    'elk.layered.nodePlacement.strategy': 'BRANDES_KOEPF',
    'elk.layered.crossingMinimization.strategy': 'LAYER_SWEEP',
    ...options,
  };

  // Build a map of branch children positions for proper ordering
  const branchChildrenMap = {};
  const branchSteps = steps?.filter((s) => s.structuralType === 'branch') || [];

  branchSteps.forEach((branch) => {
    const children = steps
      .filter((s) => s.parentStepId === branch.id)
      .sort((a, b) => a.position - b.position);
    if (children.length > 0) {
      branchChildrenMap[branch.id] = children.map((c) => c.id);
    }
  });

  // Create graph nodes with proper structure
  const graphChildren = nodes.map((node) => ({
    id: node.id,
    width: NODE_WIDTH,
    height: NODE_HEIGHT,
  }));

  // Create a modified edge list with virtual edges to enforce sequencing
  const modifiedEdges = [...edges];
  const virtualEdges = [];

  // For each branch, add strong virtual edges to enforce vertical sequencing
  Object.entries(branchChildrenMap).forEach(([, childIds]) => {
    // Add virtual edges between branch children to force sequential layout
    for (let i = 0; i < childIds.length - 1; i++) {
      // Check if edge already exists
      const existingEdge = edges.find(
        (e) => e.source === childIds[i] && e.target === childIds[i + 1],
      );
      if (!existingEdge) {
        virtualEdges.push({
          id: `virtual-${childIds[i]}-${childIds[i + 1]}`,
          source: childIds[i],
          target: childIds[i + 1],
          virtual: true,
        });
      }
    }
  });

  const graph = {
    id: 'root',
    layoutOptions: elkOptions,
    children: graphChildren,
    edges: [...modifiedEdges, ...virtualEdges].map((edge) => ({
      id: edge.id || `${edge.source}-${edge.target}`,
      sources: [edge.source],
      targets: [edge.target],
    })),
  };

  const layoutedGraph = await elk.layout(graph);

  // Extract positions from the flat layout
  const flattenedPositions = {};

  layoutedGraph.children.forEach((node) => {
    flattenedPositions[node.id] = {
      x: node.x ?? 0,
      y: node.y ?? 0,
    };
  });

  // Apply horizontal offsets for branch children to create visual branching
  const pathsSteps = steps?.filter((s) => s.structuralType === 'paths') || [];
  const BRANCH_HORIZONTAL_SPACING = 400;

  pathsSteps.forEach((pathStep) => {
    const branches = steps
      .filter(
        (s) => s.parentStepId === pathStep.id && s.structuralType === 'branch',
      )
      .sort((a, b) => a.position - b.position);

    if (branches.length > 0) {
      // Calculate center position for the branches
      const pathPosition = flattenedPositions[pathStep.id];
      if (!pathPosition) return;

      // For proper centering, calculate the total width needed
      const totalWidth = Math.max(
        0,
        (branches.length - 1) * BRANCH_HORIZONTAL_SPACING,
      );
      const startX = pathPosition.x - totalWidth / 2;

      branches.forEach((branch, index) => {
        const branchX = startX + index * BRANCH_HORIZONTAL_SPACING;

        // Move the branch node
        if (flattenedPositions[branch.id]) {
          flattenedPositions[branch.id].x = branchX;
        }

        // Move all children of this branch
        const branchChildren = steps.filter(
          (s) => s.parentStepId === branch.id,
        );
        branchChildren.forEach((child) => {
          if (flattenedPositions[child.id]) {
            flattenedPositions[child.id].x = branchX;
          }

          // Also position the end-placeholder for this child
          const endPlaceholderId = `${child.id}-end-placeholder`;
          if (flattenedPositions[endPlaceholderId]) {
            flattenedPositions[endPlaceholderId].x = branchX;
          }
        });

        // Position the placeholder for empty branches
        const branchPlaceholderId = `${branch.id}-placeholder`;
        if (flattenedPositions[branchPlaceholderId]) {
          flattenedPositions[branchPlaceholderId].x = branchX;
        }
      });
    }
  });

  // Calculate the graph width to center it
  let maxX = 0;
  Object.values(flattenedPositions).forEach((pos) => {
    const nodeRightEdge = pos.x + NODE_WIDTH;
    if (nodeRightEdge > maxX) maxX = nodeRightEdge;
  });

  // Calculate horizontal offset to center the graph
  const viewportWidth = window.innerWidth;
  const graphWidth = maxX;
  const centerOffset = Math.max(0, (viewportWidth - graphWidth) / 2);

  return {
    nodes: nodes.map((node) => {
      const position = flattenedPositions[node.id];
      if (!position) return node;

      return {
        ...node,
        position: {
          x: position.x + centerOffset,
          y: position.y + GRAPH_TOP_OFFSET,
        },
        // Since we're using hardcoded dimensions, always mark as laid out
        ...(node.type === NODE_TYPES.FLOW_STEP
          ? { data: { ...node.data, laidOut: true } }
          : {}),
      };
    }),
    edges: edges
      .filter((e) => !virtualEdges.find((ve) => ve.id === e.id))
      .map((edge) => ({
        ...edge,
        data: { ...edge.data, laidOut: true },
      })),
  };
};
