import ELK from 'elkjs/lib/elk.bundled.js';
import { DIMENSIONS } from './constants';

function createElkNode(
  id,
  width = DIMENSIONS.NODE_WIDTH,
  height = DIMENSIONS.NODE_HEIGHT,
) {
  return {
    id,
    width,
    height,
  };
}

function createElkEdge(source, target) {
  return {
    id: `${source}-to-${target}`,
    sources: [source],
    targets: [target],
  };
}

function findPathsStep(stepId, steps) {
  for (const step of steps) {
    if (step.id === stepId) {
      if (step.structuralType === 'paths') {
        return step;
      }

      return findPathsStep(step.parentStepId, steps);
    }
  }
}

function findLastActionStepOfBranch(stepId, branchId, steps) {
  if (!branchId) return false;

  const branches = {};

  for (const step of steps) {
    if (step.structuralType === 'branch') {
      branches[step.id] = branches[step.id] || [step];
    }

    if (step.structuralType === 'single' && step.parentStepId) {
      branches[step.parentStepId] = branches[step.parentStepId] || [];

      branches[step.parentStepId].push(step);
    }
  }

  const branch = branches[branchId] || branches[stepId] || [];
  const lastStepOfBranch = branch?.reverse()[0];

  return lastStepOfBranch?.id === stepId || lastStepOfBranch?.id === branchId;
}

export function createElkGraphFromSteps(steps) {
  const elkGraph = {
    id: 'root',
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.alignment': 'CENTER',
      'elk.direction': 'DOWN',
      'elk.edgeRouting': 'ORTHOGONAL',
      'elk.hierarchyHandling': 'INCLUDE_CHILDREN',
      'elk.layered.considerModelOrder.strategy': 'PREFER_EDGES',
      'elk.layered.crossingMinimization.strategy': 'LAYER_SWEEP',
      'elk.layered.cycleBreaking.strategy': 'DEPTH_FIRST',
      'elk.layered.layering.strategy': 'INTERACTIVE',
      'elk.layered.mergeEdges': false,
      'elk.layered.nodePlacement.bk.edgeStraightening': 'IMPROVE_STRAIGHTNESS',
      'elk.layered.nodePlacement.bk.fixedAlignment': 'BALANCED',
      'elk.layered.nodePlacement.strategy': 'BRANDES_KOEPF',
      'elk.layered.spacing.edgeNodeBetweenLayers': DIMENSIONS.NODE_SPACING,
      'elk.layered.spacing.nodeNodeBetweenLayers': DIMENSIONS.NODE_SPACING,
      'elk.layered.thoroughness': 10,
      'elk.spacing.nodeNode': DIMENSIONS.NODE_SPACING * 7,
      'elk.contentAlignment': 'CENTER',
      'elk.layered.nodePlacement.favorStraightEdges': true,
    },
    children: [],
    edges: [],
  };

  const createAddButtonAfter = (parentId) => `${parentId}--add-button`;
  const createAddButtonWithinBranchAfter = (parentId) =>
    `${parentId}--add-button-within-branch`;
  const createAddBranchButtonAfter = (parentId) =>
    `${parentId}--add-button-branch`;
  const createAddButtonAfterMerge = (parentId) =>
    `${parentId}--add-button-after-merge`;

  let index = 0;
  for (const step of steps) {
    const previousStep = steps[index - 1];

    const pathsStep = findPathsStep(step.id, steps);
    const isLastStepOfBranch = findLastActionStepOfBranch(
      step.id,
      step.parentStepId,
      steps,
    );

    const isStructruallySingle = step.structuralType === 'single';
    const isPathsStep = step.structuralType === 'paths';
    const isSingleStep = isStructruallySingle && !step.parentStepId;
    const isBranchActionStep = isStructruallySingle && step.parentStepId;
    const isBranchStep = step.structuralType === 'branch' && step.parentStepId;
    const isFirstStepAfterMerge =
      (previousStep?.structuralType === 'branch' ||
        previousStep?.structuralType === 'single') &&
      previousStep?.parentStepId &&
      (isSingleStep || isPathsStep);

    const addButtonAfterPreviousStepId = createAddButtonAfter(previousStep?.id);
    const addButtonAfterStepId = createAddButtonAfter(step.id);
    const addButtonAfterMergeId = createAddButtonAfterMerge(pathsStep?.id);
    const addButtonWithinBranchStepId = createAddButtonWithinBranchAfter(
      step.id,
    );
    const addBranchButtonAfterStepId = createAddBranchButtonAfter(
      pathsStep?.id,
    );

    /**
     * DRAWING ABOVE THE STEP_NODE
     */
    if (
      previousStep &&
      !isFirstStepAfterMerge &&
      !isBranchStep &&
      !isBranchActionStep
    ) {
      // +_NODE --> STEP_NODE
      elkGraph.edges.push(createElkEdge(addButtonAfterPreviousStepId, step.id));
    } else if (isBranchStep) {
      // +_NODE --> STEP_NODE
      elkGraph.edges.push(createElkEdge(addBranchButtonAfterStepId, step.id));
    } else if (isBranchActionStep) {
      const addButtonWithinBranchStepId = createAddButtonWithinBranchAfter(
        previousStep.id,
      );

      // +_NODE --> STEP_NODE
      elkGraph.edges.push(createElkEdge(addButtonWithinBranchStepId, step.id));
    } else if (isFirstStepAfterMerge) {
      const lastPathsStep = findPathsStep(previousStep.id, steps);
      const id = createAddButtonAfterMerge(lastPathsStep.id);

      // +_NODE --> STEP_NODE
      elkGraph.edges.push(createElkEdge(id, step.id));
    }

    /**
     * DRAWING THE STEP_NODE
     */
    elkGraph.children.push(createElkNode(step.id));

    /**
     * DRAWING BELOW STEP_NODE
     */
    if (isPathsStep) {
      // +_NODE
      elkGraph.children.push(
        createElkNode(
          addBranchButtonAfterStepId,
          DIMENSIONS.ADD_BUTTON_WIDTH,
          DIMENSIONS.ADD_BUTTON_HEIGHT,
        ),
      );

      // STEP_NODE --> +_NODE
      elkGraph.edges.push(createElkEdge(step.id, addBranchButtonAfterStepId));

      // +_NODE at merging point
      elkGraph.children.push(
        createElkNode(
          addButtonAfterMergeId,
          DIMENSIONS.ADD_BUTTON_WIDTH,
          DIMENSIONS.ADD_BUTTON_HEIGHT,
        ),
      );
    } else if (isLastStepOfBranch) {
      // +_NODE
      elkGraph.children.push(
        createElkNode(
          addButtonWithinBranchStepId,
          DIMENSIONS.ADD_BUTTON_WIDTH,
          DIMENSIONS.ADD_BUTTON_HEIGHT,
        ),
      );

      // STEP_NODE --> +_NODE
      elkGraph.edges.push(createElkEdge(step.id, addButtonWithinBranchStepId));

      // +_NODE --> +_NODE
      elkGraph.edges.push(
        createElkEdge(addButtonWithinBranchStepId, addButtonAfterMergeId),
      );
    } else if (isBranchStep || isBranchActionStep) {
      // +_NODE
      elkGraph.children.push(
        createElkNode(
          addButtonWithinBranchStepId,
          DIMENSIONS.ADD_BUTTON_WIDTH,
          DIMENSIONS.ADD_BUTTON_HEIGHT,
        ),
      );

      // STEP_NODE --> +_NODE
      elkGraph.edges.push(createElkEdge(step.id, addButtonWithinBranchStepId));
    } else {
      // +_NODE
      elkGraph.children.push(
        createElkNode(
          addButtonAfterStepId,
          DIMENSIONS.ADD_BUTTON_WIDTH,
          DIMENSIONS.ADD_BUTTON_HEIGHT,
        ),
      );

      // STEP_NODE --> +_NODE
      elkGraph.edges.push(createElkEdge(step.id, addButtonAfterStepId));
    }

    index++;
  }

  return elkGraph;
}

export async function layoutWithElk(steps) {
  const elk = new ELK();

  const graph = createElkGraphFromSteps(steps);
  const layoutedGraph = await elk.layout(graph);

  return layoutedGraph;
}
