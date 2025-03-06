import { generateIconUrl } from '../helpers/generate-icon-url.js';

const templateSerializer = (template) => {
  const flowDataWithIconUrls = {
    ...template.flowData,
    steps: template.flowData.steps?.map((step) => ({
      ...step,
      iconUrl: generateIconUrl(step.appKey),
    })),
  };

  return {
    id: template.id,
    name: template.name,
    flowData: flowDataWithIconUrls,
    createdAt: template.createdAt.getTime(),
    updatedAt: template.updatedAt.getTime(),
  };
};

export default templateSerializer;
