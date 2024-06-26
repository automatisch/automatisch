import cloneDeep from 'lodash/cloneDeep.js';
import { EDGE_TYPES, INVISIBLE_NODE_ID, NODE_TYPES } from './constants';

export const generateEdgeId = (sourceId, targetId) =>
  `${sourceId}--${targetId}`;

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

export const generateNodes = ({ steps, prevNodes, createdStepId }) => {
  const newNodes = steps.map((step, index) => {
    const collapsed = index !== 0;

    const prevNode = prevNodes?.find(({ id }) => id === step.id);

    let newNode;
    let childSteps = [];

    switch (step.type) {
      case 'trigger':
      case 'action': {
        if (prevNode) {
          newNode = {
            ...prevNode,
            zIndex: createdStepId ? 0 : prevNode?.zIndex || 0,
            data: {
              ...prevNode.data,
              collapsed: createdStepId
                ? true
                : prevNode?.data?.collapsed || true,
            },
          };
        } else {
          newNode = {
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
        }
        break;
      }
      case 'parallelPaths': {
        if (prevNode) {
          newNode = prevNode;
        } else {
          newNode = {
            id: step.id,
            type: NODE_TYPES.PATHS,
            position: {
              x: 0,
              y: 0,
            },
            data: {
              laidOut: false,
            },
          };
        }

        break;
      }
      case 'path': {
        if (prevNode) {
          newNode = prevNode;
        } else {
          newNode = {
            id: step.id,
            type: NODE_TYPES.PATH,
            position: {
              x: 0,
              y: 0,
            },
            data: {
              laidOut: false,
            },
          };
        }
        break;
      }
      default:
    }

    if (step?.steps?.length > 0) {
      childSteps = generateNodes({
        steps: step.steps,
        prevNodes,
        createdStepId,
      });
    }

    return [newNode, ...childSteps];
  });

  return newNodes.flat(Infinity);
};

export const generateEdges = ({ steps }) => {
  const newEdges = steps.map((step, index) => {
    switch (step.type) {
      case 'parallelPaths': {
        const edges = step.steps.map((childStep) => {
          const sourceId = step.id;
          const targetId = childStep.id;

          const newEdge = {
            id: generateEdgeId(sourceId, targetId),
            source: sourceId,
            target: targetId,
            type: EDGE_TYPES.ADD_PATH_EDGE,
            data: {
              laidOut: false,
            },
          };

          return newEdge;
        });

        const childEdges = generateEdges({ steps: step.steps });

        return [...edges, ...childEdges];
      }
      case 'path': {
        console.log({ step });

        const sourceId = step.id;
        const targetId = step.steps?.[0]?.id;

        if (targetId) {
          const newEdge = {
            id: generateEdgeId(sourceId, targetId),
            source: sourceId,
            target: targetId,
            type: EDGE_TYPES.ADD_NODE_EDGE,
            data: {
              laidOut: false,
            },
          };
          const childEdges = generateEdges({ steps: step.steps });

          return [newEdge, ...childEdges];
        }
        return null;
      }
      default: {
        const sourceId = step.id;
        const targetId = steps[index + 1]?.id;

        if (targetId) {
          return {
            id: generateEdgeId(sourceId, targetId),
            source: sourceId,
            target: targetId,
            type: EDGE_TYPES.ADD_NODE_OR_PATHS_EDGE,
            data: {
              laidOut: false,
            },
          };
        }
        return null;
      }
    }
  });

  return newEdges.flat(Infinity).filter((edge) => !!edge);
};

export const findStepByStepId = (obj, id) => {
  if (Array.isArray(obj.steps)) {
    for (const step of obj.steps) {
      if (step.id === id) {
        return step;
      }
      const result = findStepByStepId(step, id);
      if (result) {
        return result;
      }
    }
  }
  return null;
};

export function insertStep(parentObj, id, newStep) {
  function recursiveFindAndInsert(parentObj, id, newStep) {
    if (parentObj.steps && Array.isArray(parentObj.steps)) {
      for (let index = 0; index < parentObj.steps.length; index++) {
        const step = parentObj.steps[index];
        if (step.id === id) {
          if (newStep.type === NODE_TYPES.PATHS) {
            const stepsAfter = parentObj.steps.slice(
              index + 1,
              parentObj.steps.length,
            );
            parentObj.steps.splice(index + 1);
            newStep.steps[0].steps = stepsAfter;
            parentObj.steps.splice(index + 1, 0, newStep);
          } else if (step.type === NODE_TYPES.PATHS) {
            step.steps.push(newStep);
          } else if (step.type === NODE_TYPES.PATH) {
            step.steps.unshift(newStep);
          } else {
            const originalSteps = step.steps || [];
            step.steps = [];

            const newStepObject = {
              ...newStep,
              steps: originalSteps,
            };

            parentObj.steps.splice(index + 1, 0, newStepObject);
          }
          return true;
        }
        const found = recursiveFindAndInsert(step, id, newStep);
        if (found) {
          return true;
        }
      }
    }
    return false;
  }

  // Clone the input object to avoid mutating the original
  const newParentObj = cloneDeep(parentObj);
  recursiveFindAndInsert(newParentObj, id, newStep);
  return newParentObj;
}
