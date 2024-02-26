import stepSerializer from './step.js';

const flowSerializer = (flow) => {
  let flowData = {
    id: flow.id,
    name: flow.name,
    active: flow.active,
    status: flow.status,
  };

  if (flow.steps) {
    flowData.steps = flow.steps.map((step) => stepSerializer(step));
  }

  return flowData;
};

export default flowSerializer;
