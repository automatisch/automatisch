import stepSerializer from '@/serializers/step.js';
import folderSerilializer from '@/serializers/folder.js';

const flowSerializer = (flow) => {
  let flowData = {
    id: flow.id,
    name: flow.name,
    active: flow.active,
    status: flow.status,
    executionInterval: flow.executionInterval,
    createdAt: flow.createdAt.getTime(),
    updatedAt: flow.updatedAt.getTime(),
  };

  if ('isOwner' in flow) {
    flowData.isOwner = flow.isOwner;
  }

  if (flow.steps?.length > 0) {
    flowData.steps = flow.steps.map((step) => stepSerializer(step));
  }

  if (flow.folder) {
    flowData.folder = folderSerilializer(flow.folder);
  }

  return flowData;
};

export default flowSerializer;
