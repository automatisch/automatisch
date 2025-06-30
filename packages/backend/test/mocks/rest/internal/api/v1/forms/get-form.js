const getFormMock = (form) => {
  const data = {
    id: form.id,
    name: form.name,
    displayName: form.displayName,
    fields: form.fields,
    description: form.description,
    responseMessage: form.responseMessage,
    submitButtonText: form.submitButtonText,
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

export default getFormMock;
