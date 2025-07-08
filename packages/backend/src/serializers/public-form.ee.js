const publicFormSerializer = (form) => {
  const formData = {
    id: form.id,
    name: form.name,
    displayName: form.displayName,
    fields: form.fields,
    description: form.description,
    responseMessage: form.responseMessage,
    submitButtonText: form.submitButtonText,
    webhookUrl: form.webhookUrl,
    asyncRedirectUrl: form.asyncRedirectUrl,
  };

  return formData;
};

export default publicFormSerializer;
