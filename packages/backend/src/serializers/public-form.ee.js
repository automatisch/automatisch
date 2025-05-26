const publicFormSerializer = (form) => {
  const formData = {
    id: form.id,
    name: form.name,
    fields: form.fields,
    webhookUrl: form.webhookUrl,
  };

  return formData;
};

export default publicFormSerializer;
