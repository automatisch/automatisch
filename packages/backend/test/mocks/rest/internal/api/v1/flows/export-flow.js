import { expect } from 'vitest';

const exportFlowMock = async (flow, steps = []) => {
  const data = {
    id: expect.any(String),
    name: flow.name,
  };

  if (steps.length) {
    data.steps = steps.map((step) => {
      const computedStep = {
        id: expect.any(String),
        key: step.key,
        name: step.name,
        appKey: step.appKey,
        type: step.type,
        parameters: expect.any(Object),
        position: step.position,
      };

      if (step.type === 'trigger') {
        computedStep.webhookPath = expect.stringContaining('/webhooks/flows/');
      }

      return computedStep;
    });
  }

  return {
    data: data,
    meta: {
      count: 1,
      currentPage: null,
      isArray: false,
      totalPages: null,
      type: 'Object',
    },
  };
};

export default exportFlowMock;
