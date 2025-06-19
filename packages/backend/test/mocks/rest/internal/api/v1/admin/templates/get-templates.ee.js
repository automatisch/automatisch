const getTemplatesMock = async (templates) => {
  const data = templates.map((template) => ({
    id: template.id,
    name: template.name,
    createdAt: template.createdAt.getTime(),
    updatedAt: template.updatedAt.getTime(),
    flowData: template.getFlowDataWithIconUrls(),
  }));

  return {
    data: data,
    meta: {
      count: data.length,
      currentPage: null,
      isArray: true,
      totalPages: null,
      type: 'Template',
    },
  };
};

export default getTemplatesMock;
