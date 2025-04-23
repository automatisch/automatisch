const updateTemplateMock = async (template) => {
  const data = {
    id: template.id,
    name: template.name,
    createdAt: template.createdAt.getTime(),
    updatedAt: template.updatedAt.getTime(),
    flowData: template.flowData,
  };

  return {
    data: data,
    meta: {
      count: 1,
      currentPage: null,
      isArray: false,
      totalPages: null,
      type: 'Template',
    },
  };
};

export default updateTemplateMock;
