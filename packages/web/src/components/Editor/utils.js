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
const NODE_WIDTH = 300;
const NODE_HEIGHT = 80;
const GRAPH_TOP_OFFSET = 40;
const ADD_BUTTON_WIDTH = 40;
const ADD_BUTTON_HEIGHT = 40;

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
    'elk.layered.spacing.nodeNodeBetweenLayers': '40',
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
  const graphChildren = nodes.map((node) => {
    // Use smaller dimensions for AddButtonNodes
    const isAddButton = node.type === 'addButton';
    return {
      id: node.id,
      width: isAddButton ? ADD_BUTTON_WIDTH : NODE_WIDTH,
      height: isAddButton ? ADD_BUTTON_HEIGHT : NODE_HEIGHT,
    };
  });

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
  const BRANCH_HORIZONTAL_SPACING = NODE_WIDTH + 100;

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
          flattenedPositions[branch.id].x = branchX; // branch itself
        }

        // Move all children of this branch
        const branchChildren = steps.filter(
          (s) => s.parentStepId === branch.id,
        );
        branchChildren.forEach((child) => {
          if (flattenedPositions[child.id]) {
            flattenedPositions[child.id].x = branchX; // branch single itself
          }

          // Also position the AddButtonNode for this child
          const childAddButtonId = `${child.id}-add-button`;
          if (flattenedPositions[childAddButtonId]) {
            console.log(flattenedPositions[childAddButtonId].x);
            flattenedPositions[childAddButtonId].x =
              branchX + (NODE_WIDTH - ADD_BUTTON_WIDTH) / 2; // between branch singles
          }
        });

        // Position the AddButtonNode for branches
        const branchAddButtonId = `${branch.id}-add-button`;
        if (flattenedPositions[branchAddButtonId]) {
          flattenedPositions[branchAddButtonId].x =
            branchX + (NODE_WIDTH - ADD_BUTTON_WIDTH) / 2; // between branch and its first branch single child
        }
      });
    }
  });

  // Align branch end AddButtonNodes and position merge nodes
  pathsSteps.forEach((pathStep) => {
    const mergeNodeId = `${pathStep.id}-merge-placeholder`;

    // Find all branches for this paths node
    const branches = steps
      .filter(
        (s) => s.parentStepId === pathStep.id && s.structuralType === 'branch',
      )
      .sort((a, b) => a.position - b.position);

    if (branches.length > 0) {
      // Find the lowest Y position among all branch elements
      let maxY = 0;
      let endAddButtons = [];

      branches.forEach((branch) => {
        const branchChildren = steps
          .filter((s) => s.parentStepId === branch.id)
          .sort((a, b) => a.position - b.position);

        // Check branch node itself
        if (flattenedPositions[branch.id]) {
          maxY = Math.max(maxY, flattenedPositions[branch.id].y);
        }

        // Check all children of the branch and their AddButtons
        branchChildren.forEach((child) => {
          if (flattenedPositions[child.id]) {
            maxY = Math.max(maxY, flattenedPositions[child.id].y);
          }
          const childAddButtonId = `${child.id}-add-button`;
          if (flattenedPositions[childAddButtonId]) {
            maxY = Math.max(maxY, flattenedPositions[childAddButtonId].y);
          }
        });

        // Check branch's AddButton
        const branchAddButtonId = `${branch.id}-add-button`;
        if (flattenedPositions[branchAddButtonId]) {
          maxY = Math.max(maxY, flattenedPositions[branchAddButtonId].y);
        }

        // Collect end AddButtons to align later
        if (branchChildren.length > 0) {
          const lastChild = branchChildren[branchChildren.length - 1];
          const endAddButtonId = `${lastChild.id}-add-button`;
          if (flattenedPositions[endAddButtonId]) {
            endAddButtons.push(endAddButtonId);
          }
        } else {
          // For empty branches, use the branch's AddButton
          if (flattenedPositions[branchAddButtonId]) {
            endAddButtons.push(branchAddButtonId);
          }
        }
      });

      // Align all end AddButtons to be at the same Y level (below the lowest branch element)
      const addButtonY = maxY + 40;
      endAddButtons.forEach((addButtonId) => {
        if (flattenedPositions[addButtonId]) {
          flattenedPositions[addButtonId].y = addButtonY;
        }
      });

      // Position merge node below the aligned AddButtons
      if (flattenedPositions[mergeNodeId]) {
        const mergeY = addButtonY + ADD_BUTTON_HEIGHT + 40;
        const pathPosition = flattenedPositions[pathStep.id];
        if (pathPosition) {
          flattenedPositions[mergeNodeId] = {
            x: pathPosition.x + (NODE_WIDTH - ADD_BUTTON_WIDTH) / 2,
            y: mergeY,
          }; // merging point of paths step
        }
      }
    }
  });

  // Calculate the graph width to center it
  let maxX = 0;
  Object.entries(flattenedPositions).forEach(([nodeId, pos]) => {
    // Use appropriate width based on node type
    const node = nodes.find((n) => n.id === nodeId);
    const width = node?.type === 'addButton' ? ADD_BUTTON_WIDTH : NODE_WIDTH;
    const nodeRightEdge = pos.x + width;
    if (nodeRightEdge > maxX) maxX = nodeRightEdge;
  });

  // Calculate horizontal offset to center the graph
  const viewportWidth = window.innerWidth;
  const graphWidth = maxX;
  const centerOffset = Math.max(0, (viewportWidth - graphWidth) / 2);

  const computedNodes = nodes.map((node) => {
    const position = flattenedPositions[node.id];
    if (!position) return node;

    return {
      ...node,
      position: {
        x: position.x + centerOffset,
        y: position.y + GRAPH_TOP_OFFSET,
      },
      // Mark all nodes as laid out
      data: { ...node.data, laidOut: true },
    };
  });

  const computedEdges = edges
    .filter((e) => !virtualEdges.find((ve) => ve.id === e.id))
    .map((edge) => ({
      ...edge,
      data: { ...edge.data, laidOut: true },
    }));

  return {
    nodes: computedNodes,
    edges: computedEdges,
  };
};
