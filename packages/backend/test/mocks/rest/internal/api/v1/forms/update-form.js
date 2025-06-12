const updateFormMock = async (form) => {
  const data = {
    id: form.id,
    name: form.name,
    response_message: form.response_message,
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
