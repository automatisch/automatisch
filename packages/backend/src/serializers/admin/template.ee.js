const adminTemplateSerializer = (template) => {
  return {
    id: template.id,
    name: template.name,
    flowData: template.flowData,
    createdAt: template.createdAt.getTime(),
    updatedAt: template.updatedAt.getTime(),
  };
};

export default adminTemplateSerializer;
