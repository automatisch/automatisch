const getFormsMock = (forms) => {
  const data = forms.map((form) => ({
    id: form.id,
    name: form.name,
    displayName: form.displayName,
    fields: form.fields,
    description: form.description,
    responseMessage: form.responseMessage,
    submitButtonText: form.submitButtonText,
    createdAt: form.createdAt.getTime(),
    updatedAt: form.updatedAt.getTime(),
  }));

  return {
    data,
    meta: {
      count: forms.length,
      currentPage: null,
      isArray: true,
      totalPages: null,
      type: 'Form',
    },
  };
};

export default getFormsMock;
