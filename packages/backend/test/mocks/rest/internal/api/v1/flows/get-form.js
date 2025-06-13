const getFormMock = async (form, triggerStep) => {
  const data = {
    id: form.id,
    name: form.name,
    fields: form.fields,
    description: form.description,
    responseMessage: form.responseMessage,
    webhookUrl: await triggerStep.getWebhookUrl(),
  };

  return {
    data: data,
    meta: {
      count: 1,
      currentPage: null,
      isArray: false,
      totalPages: null,
      type: 'Object',
    },
  };
};

export default getFormMock;
