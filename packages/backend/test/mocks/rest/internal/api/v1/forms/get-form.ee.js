const getFormMock = (flow, formStep) => {
  const data = {
    id: flow.id,
    name: flow.name,
    fields: formStep?.parameters?.fields?.map((field) => ({
      fieldKey: field.fieldKey,
      fieldName: field.fieldName,
      fieldType: field.fieldType,
    })),
  };

  return {
    data,
    meta: {
      count: 1,
      currentPage: null,
      isArray: false,
      totalPages: null,
      type: 'Flow',
    },
  };
};

export default getFormMock;
