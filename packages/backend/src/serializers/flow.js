import stepSerializer from './step.js';

const flowSerializer = (flow) => {
  let flowData = {
    id: flow.id,
    name: flow.name,
    active: flow.active,
    status: flow.status,
    createdAt: flow.createdAt.getTime(),
    updatedAt: flow.updatedAt.getTime(),
  };

  if (flow.steps?.length > 0) {
    flowData.steps = flow.steps.map((step) => stepSerializer(step));
  }

  return flowData;
};

export default flowSerializer;
