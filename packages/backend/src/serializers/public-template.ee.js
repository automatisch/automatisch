const publicTemplateSerializer = (template) => {
  return {
    id: template.id,
    name: template.name,
    flowData: template.getFlowDataWithIconUrls(),
    createdAt: template.createdAt.getTime(),
    updatedAt: template.updatedAt.getTime(),
  };
};

export default publicTemplateSerializer;
