const publicFormSerializer = (form) => {
  const formData = {
    id: form.id,
    name: form.name,
    fields: form.fields,
    description: form.description,
    responseMessage: form.responseMessage,
    webhookUrl: form.webhookUrl,
  };

  return formData;
};

export default publicFormSerializer;
