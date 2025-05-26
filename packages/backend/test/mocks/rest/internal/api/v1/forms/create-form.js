const createFormMock = (form) => {
  const data = {
    id: form.id,
    name: form.name,
    // fields: formStep?.parameters?.fields?.map((field) => ({
    //   fieldKey: field.fieldKey,
    //   fieldName: field.fieldName,
    //   fieldType: field.fieldType,
    // })),
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
