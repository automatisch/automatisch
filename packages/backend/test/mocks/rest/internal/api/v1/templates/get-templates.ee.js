const getTemplatesMock = async (templates) => {
  const data = templates.map((template) => {
    return {
      id: template.id,
      name: template.name,
      flowData: template.getFlowDataWithIconUrls(),
      createdAt: template.createdAt.getTime(),
      updatedAt: template.updatedAt.getTime(),
    };
  });

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
