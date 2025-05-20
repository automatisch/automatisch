import { expect } from 'vitest';

const importFlowMock = async (flow, steps = []) => {
  const data = {
    name: flow.name,
    status: flow.active ? 'published' : 'draft',
    active: flow.active,
  };

  if (steps.length) {
    data.steps = steps.map((step) => ({
      appKey: step.appKey,
      iconUrl: step.iconUrl,
      key: step.key,
      name: step.name,
      parameters: expect.any(Object),
      position: step.position,
      status: 'incomplete',
      type: step.type,
    }));
  }

  return {
    data: data,
    meta: {
      count: 1,
      currentPage: null,
      isArray: false,
      totalPages: null,
      type: 'Flow',
    },
  };
};

export default importFlowMock;
