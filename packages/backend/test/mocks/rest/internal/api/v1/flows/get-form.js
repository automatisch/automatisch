const getFormMock = async (form, triggerStep) => {
  const data = {
    id: form.id,
    name: form.name,
    displayName: form.displayName,
    fields: form.fields,
    description: form.description,
    responseMessage: form.responseMessage,
    submitButtonText: form.submitButtonText,
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
