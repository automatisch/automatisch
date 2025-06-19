const createFormMock = (form) => {
  const data = {
    id: form.id,
    name: form.name,
    fields: form.fields,
    description: form.description,
    responseMessage: form.responseMessage,
    createdAt: form.createdAt.getTime(),
    updatedAt: form.updatedAt.getTime(),
  };

  return {
    data,
    meta: {
      count: 1,
      currentPage: null,
      isArray: false,
      totalPages: null,
      type: 'Form',
    },
  };
};

export default createFormMock;
