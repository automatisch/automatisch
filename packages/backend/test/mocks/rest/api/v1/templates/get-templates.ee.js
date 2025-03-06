const getTemplatesMock = async (templates) => {
  const data = templates.map((template) => ({
    id: template.id,
    name: template.name,
    flowData: template.flowData,
    createdAt: template.createdAt.getTime(),
    updatedAt: template.updatedAt.getTime(),
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
