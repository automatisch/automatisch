const updateFormMock = async (form) => {
  const data = {
    id: form.id,
    name: form.name,
    responseMessage: form.responseMessage,
    description: form.description,
    fields: form.fields,
    createdAt: form.createdAt.getTime(),
    updatedAt: form.updatedAt.getTime(),
  };

  return {
    data: data,
    meta: {
      count: 1,
      currentPage: null,
      isArray: false,
      totalPages: null,
      type: 'Form',
    },
  };
};

export default updateFormMock;
