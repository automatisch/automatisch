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

function createElkEdge(id, source, target) {
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
      'elk.alignment': 'TOP',
      'elk.direction': 'DOWN',
      'elk.edgeRouting': 'ORTHOGONAL',
      'elk.hierarchyHandling': 'INCLUDE_CHILDREN',
      'elk.layered.considerModelOrder.strategy': 'PREFER_EDGES',
      'elk.layered.crossingMinimization.strategy': 'LAYER_SWEEP',
      'elk.layered.cycleBreaking.strategy': 'DEPTH_FIRST',
      'elk.layered.layering.strategy': 'INTERACTIVE',
      'elk.layered.mergeEdges': true,
      'elk.layered.nodePlacement.bk.edgeStraightening': 'IMPROVE_STRAIGHTNESS',
      'elk.layered.nodePlacement.bk.fixedAlignment': 'BALANCED',
      'elk.layered.nodePlacement.strategy': 'BRANDES_KOEPF',
      'elk.layered.spacing.edgeNodeBetweenLayers': DIMENSIONS.NODE_SPACING,
      'elk.layered.spacing.nodeNodeBetweenLayers': DIMENSIONS.NODE_SPACING,
      'elk.layered.thoroughness': 10,
      'elk.spacing.nodeNode': DIMENSIONS.NODE_SPACING * 7,
      'elk.topdownpacking.nodeArrangement.strategy': 'LEFT',
    },
    children: [],
    edges: [],
  };

  const createAddButtonAfter = (parentId) => `${parentId}--add-button`;
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
    const isSingleStep = isStructruallySingle && !step.parentStepId;
    const isPathsStep = step.structuralType === 'paths';
    const isBranchStep = step.structuralType === 'branch';
    const isFirstStepAfterMerge =
      (previousStep?.structuralType === 'branch' ||
        previousStep?.structuralType === 'single') &&
      previousStep?.parentStepId &&
      (isSingleStep || isPathsStep);

    const addButtonAfterPreviousStepId = createAddButtonAfter(previousStep?.id);
    const addButtonAfterStepId = createAddButtonAfter(step.id);
    const addButtonAfterMergeId = createAddButtonAfterMerge(pathsStep?.id);

    if (previousStep && !isFirstStepAfterMerge && !isBranchStep) {
      elkGraph.edges.push(
        createElkEdge(
          `${addButtonAfterPreviousStepId}--edge--${step.id}`,
          addButtonAfterPreviousStepId,
          step.id,
        ),
      );
    }

    // ADD STEP NODE
    elkGraph.children.push(createElkNode(step.id));

    // ADD + NODE
    elkGraph.children.push(
      createElkNode(
        addButtonAfterStepId,
        DIMENSIONS.ADD_BUTTON_WIDTH,
        DIMENSIONS.ADD_BUTTON_HEIGHT,
      ),
    );

    // CONNECT STEP NODE TO ITS + NODE
    elkGraph.edges.push(
      createElkEdge(
        `${step.id}--edge--${addButtonAfterStepId}`,
        step.id,
        addButtonAfterStepId,
      ),
    );

    if (isPathsStep) {
      // ADD + NODE
      elkGraph.children.push(
        createElkNode(
          addButtonAfterMergeId,
          DIMENSIONS.ADD_BUTTON_WIDTH,
          DIMENSIONS.ADD_BUTTON_HEIGHT,
        ),
      );
    }

    if (isBranchStep) {
      const addButtonAfterPathsStepId = createAddButtonAfter(pathsStep.id);
      elkGraph.edges.push(
        createElkEdge(
          `${addButtonAfterPathsStepId}--edge--${step.id}`,
          addButtonAfterPathsStepId,
          step.id,
        ),
      );
    }

    if (isLastStepOfBranch) {
      elkGraph.edges.push(
        createElkEdge(
          `${addButtonAfterStepId}--edge--${addButtonAfterMergeId}`,
          addButtonAfterStepId,
          addButtonAfterMergeId,
        ),
      );
    }

    if (isFirstStepAfterMerge) {
      const lastPathsStep = findPathsStep(previousStep.id, steps);
      const id = createAddButtonAfterMerge(lastPathsStep.id);
      elkGraph.edges.push(
        createElkEdge(`${id}--edge--${step.id}`, id, step.id),
      );
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
